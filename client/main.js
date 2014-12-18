/*
var cart = {
    sum: { total: 0.00, subtotal: 0.00, tax: 0.00 },
    order_type : ORDER_TYPE[0],
    eat_where: EAT_WHERE[0],
    customer_name: "",
    reserved_time: "",
    status: ORDER_STATUS_TYPE[0],
    pay_status: "Unpaid"
};

var cartitems = [];

Session.set("cart", JSON.stringify(cart));
Session.set("cartitems", JSON.stringify(cartitems));
*/
Session.set("cart", JSON.stringify(""));
Session.set("cartItems", JSON.stringify([]));

POS = {
    getOrderById: function(id){
        var order = Orders.findOne({_id: id});
        var items = OrderItems.find({_order: order._id}).fetch();
        order.items = items;
        return order;
    },
    init_cart_session: function(){
		Session.set("selected_item", null);
		Session.set("selected_name_changer", null);
		Session.set("selected_array", 0);
		Session.set("selected_cart_item_index", null);
		Session.set("show_special_option", false);
    }
};

POS.init_cart_session();

Session.set("payment_order_id", null);

Router.route('/', function(){
	this.render('home');
});
Router.route('/kitchen', function(){
	this.render('kitchen');
});
Router.route('/orders', function(){
	this.render('list');
});
Router.route('/dashboard', function(){
	this.render('dashboard');
});
Router.route('/customer_display', function(){
	this.render('customer_display', {
		data: function() { 
			return Carts.findOne({_id: "A" });
		}
	})
});

Router.route('/register', function(){
	this.render('layout', {
		data: function() {
			console.log("new order started!");
			Session.set("modify_lock", false);
			Cart.initCart();
			POS.init_cart_session();
		}
	})
});

Router.route('/register/:_id', function(){
	this.render('layout', {
		data: function() { 
            console.log("call backToCart");
            var order = Orders.findOne({_id: this.params._id}, {reactive: false});
            if (order) {
            	console.log(order);
            	//if (order.pay_status == "Paid") Session.set("modify_lock", true);
                var items = OrderItems.find({_order: order._id}).fetch();
                Cart.backToCart(order, items);
                POS.init_cart_session();
            };
		}
	});
});

Router.route('/payment/:_id', function(){
	this.render('payment', {
		data: function() { 
			var order = Orders.findOne({_id: this.params._id}, {reactive: false});
			Session.set("payment_order_id", this.params._id);
			console.log("payment start");
			if (order) {
				order.items = OrderItems.find({_order: order._id}).fetch();
				//console.log(order.items);
				return order;
			}
		}
	})
});
Router.route('/ticket/:_id', function(){
	this.render('ticket', {
		data: function() { 
			var order = Orders.findOne(this.params._id);
			//Session.set("payment_order_id", this.params._id);
			//console.log(order);
			if (order) {
				order.items = OrderItems.find({_order: order._id}).fetch();
				//console.log(order.items);
				return order;
			}
		}
	})
});
Router.route('/receipt/:_id', function(){
	this.render('receipt', {
		data: function() { 
			var payments = Payments.findOne(this.params._id);
			if (payments) {
				payments.items = PaymentItems.find({_payments: payments._id}).fetch();
				return payments;
			}
		}
	})
});


//Meteor.call("initCart", Session.get("cart"));

Cart = {
    initCart: function() {
        var cart = {
            sum: { total: 0.00, subtotal: 0.00, tax: 0.00 },
            order_type : ORDER_TYPE[0],
            eat_where: EAT_WHERE[0],
            customer_name: "",
            reserved_time: "",
            status: ORDER_STATUS_TYPE[0],
            pay_status: "Unpaid"
		};
        this.setCart(cart);
        this.setCartItems([]);
        POS.init_cart_session();
    },
    setCart: function(cart){
        Session.set("cart", JSON.stringify(cart));
    },
    setCartItems: function(cartItems){
        Session.set("cartItems", JSON.stringify(cartItems));
    	//console.log(JSON.parse(Session.get("cartItems")));
    },
    getCartAll: function(){
    	var cart = this.getCart();
    	cart.items = this.getCartItems();
    	return cart;
    },
    getCart: function(){
    	return JSON.parse(Session.get("cart"));
    },
    getCartItems: function(){
    	return JSON.parse(Session.get("cartItems"));
    },
    getCartItem: function(index){
    	var items = JSON.parse(Session.get("cartItems"));
    	return items[index];
    },
    getLastItemIndex: function(){
    	var items = JSON.parse(Session.get("cartItems"));
    	return (items.length - 1);
    },
    addCartItem: function(item){
        var cart_items = this.getCartItems();
        var same_index = this.isSameItem(cart_items, item);
        if (same_index >= 0) {
            cart_items[same_index].qty++;
	        this.setCartItems(cart_items);
	        Session.set("selected_cart_item_index", same_index);
	        return same_index;
        }
        else {
            item._item = item._id;
            item.options = [];
            item.qty = 1;
            item.pay_status = PAY_STATUS_TYPE[1];
            var idx = Session.get("selected_cart_item_index");
            console.log(idx);
            if (idx == null) {
    	    	Session.set("selected_cart_item_index", this.getLastItemIndex()+1);
    	    	cart_items.push(item);
            }
            else {
            	cart_items.splice(idx+1,0,item);
    	    	Session.set("selected_cart_item_index", idx+1);
    	    }
	        this.setCartItems(cart_items);
	        return cart_items.length-1;
        }
    },
	isSameItem: function(items, item){
	    for (var i=0; i<items.length; i++) {
	        if (items[i]._item == item._id && items[i].SKU == item.SKU) {
	            if (items[i].options.length < 1)
	                return i;
	        }
	    }
	    return -1;
	},
    addOneMore: function(index) {
	    var items = this.getCartItems();
	    var item = items[index];
	    item.qty++;
	    this.setCartItems(items);
    },
    subtractOne: function(index) {
	    var items = this.getCartItems();
	    var item = items[index];
	    if (item.qty>1) {
	    	item.qty--;
	    	this.setCartItems(items);
 	    }
 	    //else Meteor.call("deleteItemCart", id);
    },
    deleteItemCart: function(index) {
    	var items = this.getCartItems();
    	items.splice(index,1);
    	this.setCartItems(items);
	    return true;
    },
    deleteAllItemsCart: function() {
	    this.setCartItems([]);
	    return true;
    },
    nameChange: function(option, index) {
	    var items = this.getCartItems();
	    var item = items[index];
	    if (!item.original_item) {
	        item.original_item = { name: item.name, SKU: item.SKU, price: item.price };
	    }
	    item.name = option.name;
	    item.SKU = option.SKU;
	    item.price = option.price;
	    this.setCartItems(items);
	    return option.SKU;
    },
    backToOriginal: function(index) {
	    var items = this.getCartItems();
	    var item = items[index];
	    item.name = item.original_item.name;
	    item.SKU = item.original_item.SKU;
	    item.price = item.original_item.price;
	    delete item.original_item;
	    this.setCartItems(items);
	    return "";
    },
    addOption: function(option, index) {
    	console.log(index);
	    var items = this.getCartItems();
	    var item = items[index];
	    console.log(item);
	    //if (typeof item.option === 'undefined') item.option = [];
	    item.options.push(option);
	    this.setCartItems(items);
    },
    removeOption: function(SKU, index) {
	    var items = this.getCartItems();
	    var item = items[index];
	    for (var i=0; i<item.options.length; i++) {
	        if (item.options[i].SKU == SKU) {
	            item.options.splice(i,1);
	            break;
	        }
	    }
	    this.setCartItems(items);
    },
    setOrderType: function(value){
	    var cart = this.getCart();
		cart.order_type = value;
		if (cart.order_type != ORDER_TYPE[0]) cart.eat_where = EAT_WHERE[0];
		this.setCart(cart);
    },
    setEatWhere: function(value){
	    var cart = this.getCart();
		cart.eat_where = value;
		this.setCart(cart);
    },
    setPaymentType: function(value){
	    var cart = this.getCart();
		cart.payment_type = value;
		this.setCart(cart);
    },
    setReservedTime: function(value){
	    var cart = this.getCart();
		cart.reserved_time = (value == "") ? "" : new Date(value);
		this.setCart(cart);
    },
    setCustomerName: function(value){
	    var cart = this.getCart();
		cart.customer_name = value;
		this.setCart(cart);
    },
    setCustomOption: function(option_text, option_price, index) {
	    var items = this.getCartItems();
	    var item = items[index];
	    item.custom_option = {};
	    item.custom_option.text = option_text;
	    item.custom_option.price = option_price;
		this.setCartItems(items);
    },
    backToCart: function(order, orderItems){
    	this.setCart(order);
    	this.setCartItems(orderItems);
    	//console.log(orderItems);
        //return this.getCartAll();
    }
};

Tracker.autorun(function(){
	var cartitems = JSON.parse(Session.get("cartItems"));

    var sum = { total: 0, subtotal: 0, tax: 0 };
    for (var i=0; i < cartitems.length; i++) {
        var unit_price = cartitems[i].price;
        console.log(cartitems[i]);
        for (var j=0; j<cartitems[i].options.length; j++) {
            unit_price += cartitems[i].options[j].price;
        }
        if (cartitems[i].custom_option) {
        	unit_price += parseFloat(cartitems[i].custom_option.price);
        }
        cartitems[i].subtotal = unit_price * cartitems[i].qty;
        cartitems[i].index = i;
        sum.subtotal += cartitems[i].subtotal;
    }
	sum.tax = round2(sum.subtotal * TAX / 100);
	sum.total = round2(sum.subtotal + sum.tax);
	var cart = JSON.parse(Session.get("cart"));
	cart.sum = sum;
	Session.set("cart", JSON.stringify(cart));
	Session.set("cartItems", JSON.stringify(cartitems));
	//console.log(Cart.getCartAll());
	cart.items = cartitems;
	cart._id = "A";
	Meteor.call('setCart', cart, function (error, result) {});
});

function round2(value){
	var decimals = 2;
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


Cart.initCart();

UI.registerHelper('getFirstLetter', function(text) {
	if (text)
		return text.substr(0,1).toUpperCase();
	else return null;
});

UI.registerHelper('lastTwoDigits', function(number) {
	if (number)
		return (number % 100);
	else return null;
});

UI.registerHelper('currency', function(number) {
	if (number)
		return Number(number).toFixed(2);
	else return null;
});

UI.registerHelper('toCamelCase', function(sentenceCase) {
	var out = '';
	sentenceCase.split(' ').forEach(function(el, idx){
		var add = el.toLowerCase();
		out += (idx === 0 ? add : add[0].toUpperCase() + add.slice(1));
	});
	return out;
});

UI.registerHelper('toCapitalize', function(sentenceCase) {
	var out = '';
	sentenceCase.split(' ').forEach(function(el, idx){
		var add = el.toLowerCase();
		out += add[0].toUpperCase() + add.slice(1);
	});
	return out;
});

UI.registerHelper('timeForm', function(time) {
	if (time)
		return moment(time).format('h:mm a');
	else return null;
});

UI.registerHelper('ratio', function(numA, numB) {
	return (numA / numB * 100).toFixed(0) + "%";
});


