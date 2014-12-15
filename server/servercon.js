
var Online_orders = [];
var Online_order_items = [];
var COUNTER = 0;
var DB_READ_DONE = false;

var mysql = Npm.require('mysql');

function setOnlineOrderToPOS(){
    console.log("db start: " + new Date());
    var pool = mysql.createPool({
        host : '50.87.137.80',
        port : '3306',
        database : 'teriyak1_online',
        user : 'teriyak1',
        password : 'coveN13 13'
    });

    pool.getConnection(function(err, connection) {
        var today = moment().format("YYYY-MM-DD");
        console.log("Get Connection = " + COUNTER++);
        var q = "SELECT * FROM Orders WHERE dateCreated = '" + today + "' "
            + "AND status IN ('P','T') "
            + "ORDER BY Orders.id";
        connection.query(q, function(err, rows, fields) {
            if (err) {
                throw err;
            }
            if (Online_orders.length < rows.length) {
                console.log("WE HAVE " + (rows.length - Online_orders.length) + " NEW ONLINE ORDERS!!");
                for (var i=Online_orders.length; i<rows.length; i++){
                    //console.log(rows[i].id + " " + rows[i].name + " " + rows[i].no);
                    var release = false;
                    if (i == (rows.length-1)) {
                        release = true;
                    }
                    //Online_orders.push(rows[i]);
                    Online_orders.push(rows[i]);
                    getOnlineOrderItem(connection, Online_orders[Online_orders.length-1], release);
                }
            }
            else {
                console.log("NO NEW ONLINE ORDERS!");
                connection.destroy();
            }
        });

    });
}

function getOnlineOrderItem(connection, order, release){
    connection.query("SELECT * FROM Order_item WHERE order_id = '" + order.id + "'", function(err, rows, fields) {
        if (err) throw err;
        order.items = [];
        for (var i=0; i<rows.length; i++){
            getOnlineOrderOption(connection, order, rows[i], release);
        }
    });
}

function getOnlineOrderOption(connection, order, item, release){
    
    connection.query("SELECT * FROM Order_item_option WHERE order_id = '" + order.id + "' AND item_no = '" + item.no + "'", function(err, rows, fields) {
        if (err) throw err;
        item.options = [];
        if (rows.length > 0) {
            for (var j=0; j<rows.length; j++) {
                var option = { SKU: rows[j].option_name, name: rows[j].option_name, price: rows[j].option_price };
                item.options.push(option);
            }
        }
        order.items.push(item);
        //console.log(item);
        if (release == true) {
            DB_READ_DONE = true;
            //connection.destroy();
            //saveOnlineOrderDB();
            //console.log("Connection release!");
            //connection.destroy();
        }
        //Online_order_items.push(order);
        //console.log(Online_orders[0].item);

    });
}

function saveOnlineOrderDB(){
    console.log("local start: " + new Date());
    console.log("online order count => " + Online_orders.length);
    for (var i=0; i<Online_orders.length; i++){
        if (Online_orders[i].inserted) {

        }
        else {
            console.log(Online_orders[i].id + " will be inserted!");
            //console.log(Online_order_items[i]);
            convertOnlineOrderToPOS(Online_orders[i]);
            Online_orders[i].inserted = true;
        }
    }
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
            pay_staus: "Unpaid",
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
            var item = {
                SKU: online.items[i].abbr,
                name: online.items[i].name,
                _order: order_id,
                job: online.items[i].job,
                pay_status: "Selected",
                qty: online.items[i].count,
                price: (online.items[i].price/online.items[i].count),
                subtotal: online.items[i].price,
                option: online.items[i].options
            };
            //console.log(item);
            OrderItems.insert(item);
        }
    }

}

Meteor.setInterval(function(){
    setOnlineOrderToPOS();
    var handle = Meteor.setInterval(function(){
        if (DB_READ_DONE) {
            saveOnlineOrderDB(); 
            DB_READ_DONE = false;
            Meteor.clearInterval(handle);
        }     
    }, 2000);
}, 30000);

