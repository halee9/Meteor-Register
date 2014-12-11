
init_reserved_time();

Template.customer_name.events({
    "click button": function(theEvent, theTemplate){
        var input = theTemplate.find("input");
        var name = $(input).val();
        console.log("customer name updated")
        Cart.setCustomerName(name);
        //Meteor.call("setCustomerName", name);
    }
});

Template.reserved_time.events({
    "click button.clock_show": function(theEvent, theTemplate){
        var hours = getHours();
        Session.set("selected_time", hours[0].format());
        Session.set("hours", JSON.stringify(hours));
        Cart.setReservedTime(Session.get("selected_time"));
        //Meteor.call("setReservedTime", Session.get("selected_time")); 
    },
    "click button.delete": function(theEvent, theTemplate){
        Cart.setReservedTime("");
        //Meteor.call("setReservedTime", "");
        init_reserved_time();
    },
    "click button.hour": function(theEvent, theTemplate){
        console.log(this.val);
        get5unitminutes(moment(this.val));
        var button_min = theTemplate.find("button.minute");
        Session.set("selected_hour", this.hour);
        Session.set("selected_minute", 0);
        console.log(Session.get("selected_hour"));
        Session.set("selected_time", this.val._i);
        Cart.setReservedTime(Session.get("selected_time"));
        //Meteor.call("setReservedTime", Session.get("selected_time"));
        //$(button_min).trigger("click");
    },
    "click button.minute": function(theEvent, theTemplate){
        console.log(this);
        Session.set("selected_minute", this.minute);  
        Session.set("selected_time", this.val._i);
        Cart.setReservedTime(Session.get("selected_time"));
        //Meteor.call("setReservedTime", Session.get("selected_time")); 
    }
});

Template.customer.events({
    'click button.close_customer_window': function () {
        $(".customer").hide();
    }
});

Template.reserved_time.helpers({
    hours: function () {
        var h_array = JSON.parse(Session.get("hours"));
        var hours = [];
        if (h_array) {
            for (var i=0; i<h_array.length; i++){
                var h = {};
                h.hour = moment(h_array[i]).format('h a');
                h.val = moment(h_array[i]);
                hours.push(h);
            }
            return hours;
        }
    },
    minutes: function () {
        var m_array = JSON.parse(Session.get("minutes"));
        var mins = [];
        if (m_array) {
            for (var i=0; i<m_array.length; i++){
                var m = {};
                m.minute = moment(m_array[i]).format('mm');
                m.val = moment(m_array[i]);
                mins.push(m);
            }
            return mins;
        }
    },
    hour_selected: function () {
        return Session.equals("selected_hour", this.hour) ? "selected" : '';
    },
    minute_selected: function () {
        return Session.equals("selected_minute", this.minute) ? "selected" : '';
    },
    reserved_time: function(){
        var t = Session.get("selected_time");
        if (t != null)
            return moment(t).format('hh:mm a');
    },
    no_time: function(){
        if (Session.get("selected_time") == null) return true;
        else return false;
    }
});


function getHours(){
    var now = moment().add(5, 'minutes');
    if (now.minute() >= 55) {
        now = now.add(1, 'hours');
        now = now.startOf('hour');
    }
    //console.log(now.minute());
    //get5unitminutes(now.minute());
    var hours = [];
    hours.push(moment(now));
    for (var i=0; i<8; i++){
        var h = now.add(1, 'hours');
        hours.push(moment(h).startOf('hour'));
    }
    return hours;
}

function get5unitminutes(time){
    var min = time.minute();
    var base = 5 * Math.ceil(min/5);
    var hour = time.startOf('hour');
    var mins = [];
    do {
        mins.push(moment(hour).add(base, 'minutes'));
        base += 5;
    }
    while (base < 60);
    Session.set("minutes", JSON.stringify(mins));
    console.log(mins);
    return mins;
}

function init_reserved_time() {
    Session.set("selected_hour", null);
    Session.set("selected_minute", null);
    Session.set("selected_time", null);
    Session.set("hours", null);
    Session.set("minutes", null);
}
/*
console.log(getHours());
console.log(get5unitminutes(2));
console.log(get5unitminutes(13));
console.log(get5unitminutes());
*/
