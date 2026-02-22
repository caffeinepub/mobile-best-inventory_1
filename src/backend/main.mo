import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

actor {
  type Product = {
    id : Nat;
    name : Text;
    category : Category;
    purchasePrice : Nat;
    salePrice : Nat;
    quantity : Nat;
    createdAt : Int;
  };

  type Category = {
    #Cable;
    #Charger;
    #Handsfree;
    #PowerBank;
    #Cover;
    #TemperedGlass;
    #Other;
  };

  type Sale = {
    id : Nat;
    productId : Nat;
    productName : Text;
    quantity : Nat;
    salePrice : Nat;
    purchasePrice : Nat;
    profit : Nat;
    date : Int;
  };

  type Settings = {
    lockEnabled : Bool;
    pin : Text;
  };

  type ProductInput = {
    name : Text;
    category : Category;
    purchasePrice : Nat;
    salePrice : Nat;
    quantity : Nat;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      switch (Text.compare(p1.name, p2.name)) {
        case (#equal) { Nat.compare(p1.id, p2.id) };
        case (order) { order };
      };
    };

    public func compareByQuantity(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.quantity, p2.quantity);
    };
  };

  module Sale {
    public func compareByDate(s1 : Sale, s2 : Sale) : Order.Order {
      Int.compare(s1.date, s2.date);
    };
  };

  let products = Map.empty<Nat, Product>();
  let sales = Map.empty<Nat, Sale>();
  var nextProductId = 1;
  var nextSaleId = 1;
  var settings : Settings = { lockEnabled = false; pin = "" };

  public shared ({ caller }) func addProduct(input : ProductInput) : async Nat {
    let id = nextProductId;
    nextProductId += 1;

    let product : Product = {
      id;
      name = input.name;
      category = input.category;
      purchasePrice = input.purchasePrice;
      salePrice = input.salePrice;
      quantity = input.quantity;
      createdAt = Time.now();
    };

    products.add(id, product);
    id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, input : ProductInput) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduct : Product = {
          id;
          name = input.name;
          category = input.category;
          purchasePrice = input.purchasePrice;
          salePrice = input.salePrice;
          quantity = input.quantity;
          createdAt = Time.now();
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) { products.remove(id) };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getLowStockProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.quantity < 5 });
  };

  public shared ({ caller }) func recordSale(productId : Nat, quantity : Nat) : async Nat {
    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };

    if (product.quantity < quantity) {
      Runtime.trap("Insufficient stock");
    };

    let sale : Sale = {
      id = nextSaleId;
      productId;
      productName = product.name;
      quantity;
      salePrice = product.salePrice;
      purchasePrice = product.purchasePrice;
      profit = (product.salePrice - product.purchasePrice) * quantity;
      date = Time.now();
    };

    nextSaleId += 1;

    // Update product quantity
    let updatedProduct : Product = {
      id = product.id;
      name = product.name;
      category = product.category;
      purchasePrice = product.purchasePrice;
      salePrice = product.salePrice;
      quantity = product.quantity - quantity;
      createdAt = product.createdAt;
    };

    products.add(productId, updatedProduct);
    sales.add(sale.id, sale);
    sale.id;
  };

  public query ({ caller }) func getSalesByDateRange(start : Int, end : Int) : async [Sale] {
    sales.values().toArray().filter(
      func(sale) {
        sale.date >= start and sale.date <= end
      }
    ).sort(Sale.compareByDate);
  };

  public query ({ caller }) func getSettings() : async Settings {
    settings;
  };

  public shared ({ caller }) func updatePin(newPin : Text) : async () {
    if (newPin.size() != 4 or not newPin.toArray().all(func(c) { c >= '0' and c <= '9' })) {
      Runtime.trap("PIN must be a 4-digit number");
    };
    settings := { lockEnabled = settings.lockEnabled; pin = newPin };
  };

  public shared ({ caller }) func toggleLock() : async () {
    settings := { lockEnabled = not settings.lockEnabled; pin = settings.pin };
  };
};
