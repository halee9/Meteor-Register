var max_count = 0;

Template.itemlist_1.helpers({
    items: function () {
        return getItemsByColume(1);
    }
});
Template.itemlist_2.helpers({
    items: function () {
        return getItemsByColume(2);
    }
});
Template.itemlist_3.helpers({
    items: function () {
        return getItemsByColume(3);
    }
});
Template.itemlist_4.helpers({
    items: function () {
        return getItemsByColume(4);
    }
});

function getItemsByColume(colume){
    var categories = Categories.find({ colume: colume }).fetch();
    var items = [];
    for (var i=0; i < categories.length; i++) {
        var cursor = Items.find({ _category: categories[i]._id }).fetch();
        for (var j=0; j < cursor.length; j++) {
            cursor[j].background = categories[i].background;
            cursor[j].color = categories[i].color;
            items.push(cursor[j]);
        }
    }
    if (max_count < items.length) max_count = items.length;
    return items;
}

function getItemsByRow(row){
    var items = Items.find({ row: row }).fetch();
    for (var i=0; i < items.length; i++) {
        var cate = Categories.findOne({ _id: items[i]._category });
        if (cate) {
            items[i].background = cate.background;
            items[i].color = cate.color;
        }
    }
    if (max_count < i) max_count = i;
    return items;
}

Template.item.helpers({
    selected : function(){
        return Session.equals("selected_item", this._id) ? "selected" : '';
    }
});

Template.item.events({
    "click": function(e, temp){
        if (Session.get("modify_lock")) return;
        Session.set("selected_item", temp.data._id);
        Session.set("show_special_option", false);
        Cart.addCartItem(temp.data);
        //Session.set('selected_cart_item_index', Cart.getLastItemIndex());
        Session.set("selected_modifier_group", null);
        Session.set('selected_name_changer', null);
    }
});

function setMenuItemHeight() {
    console.log("max="+max_count);
    console.log($(window).height());
    var win_height = $(window).height();
    console.log($(".header").height());
    var header_height = $(".header").height();
    var item_height = ((win_height - header_height) / (max_count+1)) - 16;
    if (item_height < 50) item_height = 50;
    $(".menu .item").height(item_height);
    console.log(item_height);
};
setMenuItemHeight();
Meteor.startup(function() {
  $(window).resize(function(evt) {
    console.log("resizing!!!");
    setMenuItemHeight();
  });
});
