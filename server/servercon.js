Fiber = Npm.require('fibers');
Mysql = Npm.require('mysql');

RemoteDB = Mysql.createPool({
    host : '50.87.137.80',
    port : '3306',
    database : 'teriyak1_online',
    user : 'teriyak1',
    password : 'coveN13 13'
});

var COUNTER = 0;

Meteor.startup(function () {
    setOnlineOrderToPOS();
    Meteor.setInterval(function(){
        setOnlineOrderToPOS();
    }, 30000);
});

function setOnlineOrderToPOS(){
    console.log("db start: " + new Date());
    var online_order = Orders.findOne({},{sort:{online_id: -1}});
    if (online_order)
        var last_id = online_order.online_id;
    else var last_id = 0;
    console.log("last Online ID: " + last_id);

    RemoteDB.getConnection(function(err, connection) {

        var today = moment().format("YYYY-MM-DD");
        console.log("Get Connection = " + COUNTER++);
        var q = "SELECT * FROM Orders WHERE dateCreated = '" + today + "' "
            + "AND id > " + last_id + " "
            + "AND status IN ('P','T','D') "
            + "ORDER BY id";
        var count3 = 0;
        var items_length = 0;
        connection.query(q, function(err, rows, fields) {
            if (err) throw err;
            console.log("WE HAVE " + rows.length + " NEW ONLINE ORDERS!!");
            var orders = [];
            for (var i=0; i<rows.length; i++){
                orders.push(rows[i]);
                connection.query("SELECT * FROM Order_item WHERE order_id = '" + rows[i].id + "'", function(err2, rows2, fields2) {
                    if (err2) throw err2;
                    for (var j=0; j<rows2.length; j++){
                        var index = getIndexById(orders, rows2[j].order_id);
                        if (!orders[index].items) orders[index].items = [];
                        orders[index].items.push(rows2[j]);
                        items_length++;
                        connection.query("SELECT * FROM Order_item_option WHERE order_id = '" 
                            + rows2[j].order_id + "' AND item_no = '" + rows2[j].no + "'", function(err3, rows3, fields3) {
                            if (err3) throw err3;
                            for (var k=0; k<rows3.length; k++) {
                                var index = getIndexById(orders, rows3[k].order_id);
                                var i_index = rows3[k].item_no-1;
                                var option = { SKU: rows3[k].option_name, name: rows3[k].option_name, price: rows3[k].option_price };
                                if (!orders[index].items[i_index].options) orders[index].items[i_index].options = [];
                                orders[index].items[i_index].options.push(option);
                            }
                            count3++;
                            if (count3 == items_length) {
                                console.log("end query3: "+count3+ " "+items_length);
                                saveOnlineOrderDB(orders);
                            }
                        });
                    }
                });
            }
        });
    });
}

function getIndexById(orders, id) {
    for (var i=0; i<orders.length; i++){
        if (orders[i].id == id) return i;
    }
    return -1;
}


function saveOnlineOrderDB(orders){
    console.log("local start: " + new Date());
    console.log("online order count => " + orders.length);
    Fiber(function(){
        for (var i=0; i<orders.length; i++){
            console.log(orders[i].id + " will be inserted!");
            convertOnlineOrderToPOS(orders[i]);
        }
    }).run();
}


function convertOnlineOrderToPOS(online){
    var order = Orders.findOne({ online_id: online.id });
    
    if (order) {
        var order_id = order._id;
        console.log(order.online_id + " is already exist!");
    }
    else {
        var eat_where = (online.order_type == "P") ? "Togo" : "Here";
        var reserved_time = (online.cust_pickup_time == "ASAP") ? "" : moment(online.cust_pickup_time, "h:mm A")._d;
        var order = {
            created_at: (new Date()),
            customer_name: online.cust_name,
            customer_phone: online.cust_phone,
            eat_where: eat_where,
            order_type: "Online",
            pay_status: "Unpaid",
            reserved_time: reserved_time,
            status: "Taken",
            sum: {
                sutotal: online.subtotal,
                tax: online.tax,
                total: online.total
            },
            online_id: online.id
        };
        var order_id = Meteor.call("addNewOrder", order);

        console.log("items=>"+online.items.length);
        for (var i=0; i<online.items.length; i++){
            if (online.items[i].special_instruction.length > 0) {
                var custom_option = {text: online.items[i].special_instruction, price: 0}
            }
            else var custom_option = {};
            if (online.items[i].options == null) online.items[i].options = [];
            var item = {
                SKU: online.items[i].abbr,
                name: online.items[i].name,
                _order: order_id,
                job: online.items[i].job,
                pay_status: "Selected",
                qty: online.items[i].count,
                price: (online.items[i].price/online.items[i].count),
                subtotal: online.items[i].price,
                options: online.items[i].options,
                custom_option: custom_option,
                online_id: online.id
            };
            //console.log(item);
            OrderItems.insert(item);
        }
    }

}

