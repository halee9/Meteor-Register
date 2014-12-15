Session.set("selected_modifier_group", null);
Session.set("selected_modifier_items", JSON.stringify([]));

Template.modifier_group.events({
    "click": function(theEvent, theTemplate){
        Session.set("selected_modifier_group", this._id);
    }
});

Template.modifier_item.events({
    "click": function(theEvent, theTemplate){
        var cart_index = Session.get("selected_cart_item_index");
        if (hasOption(this.SKU, cart_index)) {
            Cart.removeOption(this.SKU, cart_index);
        }
        else {
            Cart.addOption(this, cart_index);
        }
    }
});

Template.addon_item.events({
    "click": function(theEvent, theTemplate){
        clickModifier(this, theEvent, theTemplate);
    }
});

Template.name_changer_item.events({
    "click": function(theEvent, theTemplate){
        var div = theTemplate.find(".item");
        var index = Session.get("selected_cart_item_index");
        if ($(div).hasClass("selected")) {
            var response = Cart.backToOriginal(index);
            Session.set('selected_name_changer', response);
        }
        else {
            var response = Cart.nameChange(this, index);
            Session.set('selected_name_changer', response);
        }
    }
});


Template.addons.helpers({
    addon_items: function(){
        var id = Session.get("selected_item");
        var modifier_items = [];
        if (id) {
            var item = Items.findOne({ _id: id });
            if (typeof item._modifier !== "undefined") {
                for (var j=0; j < item._modifier.length; j++) {
                    if (item._modifier[j] != "addon") continue;
                    var temp_items = Modifiers.findOne({ _id: item._modifier[j] });
                    for (var i=0; i < temp_items.items.length; i++) {
                        temp_items.items[i].background = temp_items.background;
                        modifier_items.push(temp_items.items[i]);
                    }
                }
            }
        }
        return modifier_items;
    },
    selected: function(){
        var index = Session.get("selected_cart_item_index");
        return hasOption(this.SKU, index) ? "selected" : '';
    }
});

Template.modifier_group.helpers({
    selected: function(){
        return Session.equals("selected_modifier_group", this._id) ? "selected" : '';    
    },
    items_count: function(){
        var cart_index = Session.get("selected_cart_item_index");
        var count = 0;
        for (var i=0; i<this.items.length; i++){
            if (hasOption(this.items[i].SKU, cart_index)) count++;
        }
        return (count>0) ? count : false;
    }
});
Template.name_changer_item.helpers({
    selected: function () {
        return Session.equals("selected_name_changer", this.SKU) ? "selected" : '';
    }
});

Template.modifiers.helpers({
    items: function () {
        var id = Session.get("selected_item");
        var modifier_groups = [];
        if (id) {
            var item = Items.findOne({ _id: id });
            if (item) {
                if (item._modifier) {
                    for (var j=0; j < item._modifier.length; j++) {
                        var temp_items = Modifiers.findOne({ _id: item._modifier[j] });
                        modifier_groups.push(temp_items);
                    }
                }
            }
        }
        return modifier_groups;
    }
});
/*
/** define modifiers in the item.
Template.modifiers.helpers({
    items: function () {
        var id = Session.get("selected_item");
        var modifier_groups = [];
        if (id) {
            var item = Items.findOne({ _id: id });
            if (item) {
                if (item._modifier) {
                    for (var j=0; j < item._modifier.length; j++) {
                        var temp_items = Modifiers.findOne({ _id: item._modifier[j] });
                        modifier_groups.push(temp_items);
                    }
                }
            }
        }
        return modifier_groups;
    }
});
*/

Template.modifier_items.helpers({
    items: function () {
        var id = Session.get("selected_modifier_group");
        if (id) {
            var modifier = Modifiers.findOne({ _id: id });
            for (var i=0; i<modifier.items.length; i++)
                modifier.items[i].background = modifier.background;
            return modifier.items;
        }
    }
});

Template.modifier_item.helpers({
    selected: function () {
        /*
        var items = JSON.parse(Session.get("selected_modifier_items"));
        var index = items.indexOf(this.SKU);
        console.log(this.SKU + " " + index);
        return (index > -1) ? "selected" : "";
        */
        var cart_index = Session.get("selected_cart_item_index");
        return (hasOption(this.SKU, cart_index)) ? "selected" : "";
    }
});
/*
Template.modifier_item.helpers({
    selected: function(){
        var index = Session.get("selected_cart_item_index");
        return hasOption(this.SKU, index) ? "selected" : '';
    }
});
*/



Template.name_changer.helpers({
    items: function () {
        var id = Session.get("selected_item");
        var modifier_items = [];
        if (id) {
            var item = Items.findOne({ _id: id });
            if (item._replace) {
            var temp_items = Replaces.findOne({ _id: item._replace });
                for (var i=0; i < temp_items.items.length; i++) {
                    temp_items.items[i].background = temp_items.background;
                    temp_items.items[i].action = temp_items.action;
                    modifier_items.push(temp_items.items[i]);
                }
            }
        }
        return modifier_items;
    }
});

function clickModifier(thisObject, theEvent, theTemplate) {
    var div = theTemplate.find(".item");
    var index = Session.get("selected_cart_item_index");
    if ($(div).hasClass("selected")) {
        $(div).removeClass("selected");
        Cart.removeOption(thisObject.SKU, index);
    }
    else {
        $(div).addClass("selected");
        Cart.addOption(thisObject, index);
    }
}

function hasOption(SKU, id){
    if (id != null) {
        var item = Cart.getCartItem(id);
        if (item) {
            for (var i=0; i<item.options.length; i++) {
                if (item.options[i].SKU == SKU) {
                    return true;
                }
            }
        }
        return false;
    } else return false;
}


