Template.modifier_item.events({
    "click": function(theEvent, theTemplate){
        clickModifier(this, theEvent, theTemplate);
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

Template.modifier_item.helpers({
    selected: function(){
        var index = Session.get("selected_cart_item_index");
        //console.log("id:"+id);
        return hasOption(this.SKU, index) ? "selected" : '';
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
        var modifier_items = [];
        if (id) {
            var item = Items.findOne({ _id: id });
            if (item) {
                if (item._modifier) {
                    for (var j=0; j < item._modifier.length; j++) {
                        if (item._modifier[j] == "addon") continue;
                        var temp_items = Modifiers.findOne({ _id: item._modifier[j] });
                        if (temp_items.action == "replace") continue;
                        for (var i=0; i < temp_items.items.length; i++) {
                            temp_items.items[i].background = temp_items.background;
                            temp_items.items[i].action = temp_items.action;
                            modifier_items.push(temp_items.items[i]);
                        }
                    }
                }
            }
        }
        return modifier_items;
    }
});

Template.name_changer.helpers({
    items: function () {
        var id = Session.get("selected_item");
        var modifier_items = [];
        if (id) {
            var item = Items.findOne({ _id: id });
            if (item._modifier) {
                for (var j=0; j < item._modifier.length; j++) {
                    if (item._modifier[j] == "addon") continue;
                    var temp_items = Modifiers.findOne({ _id: item._modifier[j] });
                    if (temp_items.action == "replace") {
                        for (var i=0; i < temp_items.items.length; i++) {
                            temp_items.items[i].background = temp_items.background;
                            temp_items.items[i].action = temp_items.action;
                            modifier_items.push(temp_items.items[i]);
                        }
                    }
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
            for (var i=0; i<item.option.length; i++) {
                if (item.option[i].SKU == SKU) {
                    return true;
                }
            }
        }
        return false;
    } else return false;
}


