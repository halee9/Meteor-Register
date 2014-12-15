Template.order_info.events({
    "click .order_type": function(theEvent, theTemplate){
        var obj = theTemplate.find(".order_type");
        var type = $(obj).val();
        Cart.setOrderType(getNextToggle(ORDER_TYPE, type));
    },
    "click .eat_where": function(theEvent, theTemplate){
        var obj = theTemplate.find(".eat_where");
        var type = $(obj).val();
        Cart.setEatWhere(getNextToggle(EAT_WHERE, type));
    }
});

Template.order_total.events({
    "click .total": function(theEvent, theTemplate){
        $(".customer").show();
    }
 });


Template.order_cart_item.events({
    "click": function(theEvent, theTemplate){
        console.log(theTemplate.data);
        if (isCartItemSelected(theTemplate.data)) {
            Session.set("show_special_option", true);
        }
        else {
            Session.set("selected_item", theTemplate.data._item);
            if (theTemplate.data.original_item)
                Session.set("selected_name_changer", theTemplate.data.SKU);
            else 
                Session.set("selected_name_changer", null);
            Session.set("selected_cart_item_index", theTemplate.data.index);
            console.log(Session.get("selected_cart_item_index"));
            Session.set("show_special_option", false);
            //addItemCart(this);
        }
        Session.set("selected_modifier_group", null);
    },
    "keyup input": function(theEvent, theTemplate) {
        var index = Session.get("selected_cart_item_index");
        var text = theTemplate.find("input.custom_option_text");
        var option_name = $(text).val();
        var input_price = theTemplate.find("input.custom_option_price");
        var price = (isNaN(parseFloat($(input_price).val()))) ? 0 : parseFloat($(input_price).val());
        //console.log(price);
        var option_price = (price >= 0 ) ? price : 0;
        Cart.setCustomOption(option_name, option_price, index);
    },
    "click button.plus": function(){
        var index = Session.get("selected_cart_item_index");
        Cart.addOneMore(index);
    },
    "click button.minus": function(){
        var index = Session.get("selected_cart_item_index");
        Cart.subtractOne(index);
    }
});

Template.cart_control.events({
    "click button.remove_cart_item": function(){
        var index = Session.get("selected_cart_item_index");
        if (index == null) {
            Cart.deleteAllItemsCart();
        }
        else {
            Cart.deleteItemCart(index);
        }
        Session.set("selected_item", null);
        Session.set("selected_cart_item_index", null);
    },
    "click .send_order": function(theEvent, theTemplate){
        var cart = Cart.getCart();
        var items = Cart.getCartItems();
        Meteor.call("addOrder", cart, items, function(err, response){
            if (response.order_type != ORDER_TYPE[0]) {
                Cart.initCart();
            }
            else {
                Router.go("/ticket/"+response.order_id);
            }
        });
    },
    "click .cancel_modify": function(theEvent, theTemplate){
        Cart.initCart();
        Router.go("/register");
    },
    "click .send_credit_payment": function(){
        var cart = Cart.getCart();
        var items = Cart.getCartItems();
        Meteor.call("addOrder", cart, items, function(err, response){
            if (response.order_type != ORDER_TYPE[0]) {
                Cart.initCart();
            }
            else {
                Meteor.call('addPayment', response.order_id, cart.sum.total, 0, 0, cart.sum, function (error, response) {
                    Router.go("/ticket/"+response.order_id);
                });
            }
        });
    }
});

function isCartItemSelected(obj){
    if (Session.equals("selected_item", obj._item) &&
        Session.equals("selected_cart_item_index", obj.index)) return true;
    else return false;
}

Template.order_info.helpers({
    order_type_icon: function(){
        if (this.order_type == ORDER_TYPE[0]) return "male";
        else if (this.order_type == ORDER_TYPE[1]) return "phone";
        else if (this.order_type == ORDER_TYPE[2]) return "bolt";
    },
    eat_where_icon: function(){
        if (this.eat_where == EAT_WHERE[0]) return "gift";
        else if (this.eat_where == EAT_WHERE[1]) return "cutlery";
    }
});

Template.order_cart_item.helpers({
    qty_show: function () {
        if (this.qty > 1) return true;
        else return false;
    },
    selected: function(){
        if (Session.equals("selected_cart_item_index", this.index)) return "selected";
        else return '';
    },
    show: function(){
        //console.log("Show: "+Session.get("show_special_option"));
        if (isCartItemSelected(this) &&
            Session.equals("show_special_option", true))
            return "show";
        else return '';
    }
});

Template.cart.helpers({
    cart: function () {
        return Cart.getCartAll();
    }
});

Template.order_total.helpers({
    currency: function (num) {
        return Number(num).toFixed(2);
    },
    reserved_time: function(){
        if (this.reserved_time)
            return 'at ' + moment(this.reserved_time).format('hh:mm a');
    }
});

Template.cart_control.helpers({
    cart_item_unselected: function(){
        var index = Session.get("selected_cart_item_index");
        if (index == null) return true;
        else return false;
    },
    update_mode: function(){
        //console.log(this);
        if (this._id) return true;
        else return false;
    }
});




function getNextToggle(array, value) {
    var index = array.indexOf(value);
    if (index >= 0) {
        var newIndex = ((index+1) >= array.length) ? 0 : index+1;
        return array[newIndex];
    }
    else return array[0];
}



