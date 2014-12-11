Template.customer_ticket.helpers({
    currency: function (num) {
        return Number(num).toFixed(2);
    }
});

Template.customer_ticket.rendered = function () {
    if (this.data) {
        if (this.data.order_type == ORDER_TYPE[0]) {
            window.print();
            Router.go("/payment/"+this.data._id);
        }
        else {
            if (this.data.pay_status == "Paid") {
                window.print();
                Router.go("/register");
            }
            else {
                Router.go("/register");
            }
        }
    }
};