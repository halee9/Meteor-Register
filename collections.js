Items = new Mongo.Collection("items");
Categories = new Mongo.Collection("categories");
Replaces = new Mongo.Collection("replaces");
Modifiers = new Mongo.Collection("modifiers");
Addons = new Mongo.Collection("addons");
Carts = new Mongo.Collection("Carts");
Orders = new Mongo.Collection("orders");
OrderItems = new Mongo.Collection("orderItems");
Payments = new Mongo.Collection("payments");
PaymentItems = new Mongo.Collection("paymentItems");
OnlineOrders = new Mongo.Collection("onlineOrders");
OnlineOrderItems = new Mongo.Collection("onlineOrderItems");
Sales = new Mongo.Collection("sales");

NewOrder = new Mongo.Collection("newOrder");

TAX = 9.5;

ORDER_TYPE = [ "Walk-in", "Phone", "Online" ];
EAT_WHERE = [ "Togo", "Here" ];
PAYMENT_TYPE = [ "Unpaid", "Credit", "Cash" ];
ORDER_STATUS_TYPE = [ "Taken", "Ready", "Done", "Removed"];
PAY_STATUS_TYPE = [ "Unselected", "Selected", "Paid"];
SPECIAL_PRICE_TYPE = [
	{ name: "50% OFF", value: 0.5 },
	{ name: "10% OFF", value: 0.1 },
	{ name: "ON THE HOUSE", value: 0 }
];

UTIL = {
	round: function(value, decimals){
		return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
	}
}

MIDORI = {
	getTotal: function(subtotal){
		var result = {};
		result.subtotal = UTIL.round(subtotal, 2);
		result.tax = UTIL.round((subtotal * TAX / 100),2);
		result.total = UTIL.round((result.subtotal+result.tax),2);
		return result;
	}
}

/*
CartItems.find().observe({
    changed: function(){
        console.log("cart changed!!")
    }
});

*/