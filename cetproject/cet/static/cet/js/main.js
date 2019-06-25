function inputwithlabel(props) {
    var autofocus = false;
    var l = document.createElement('label');
    l.innerHTML = props.label;
    var i = document.createElement('input');
    i.id = props.modalName + "_input_" + props.label;
    i.id = i.id.replace(/ /g, '').replace(/\?/g, '');
    l.for = i.id;
    if (props.autofocus != null) {
        autofocus = true;
    }
    i.autofocus = autofocus;
    i.setAttribute('class', 'modal_input');
    l.setAttribute('class', 'modal_label');
    i.type = props.type;
    var wrapper = document.createElement('div');
    wrapper.appendChild(i);
    wrapper.appendChild(l);
    wrapper.setAttribute('class', 'input_label_modal_wrapper');
    return wrapper;
}

function textfieldwithlabel(props) {
    var autofocus = false;
    var l = document.createElement('label');
    l.innerHTML = props.label;
    var i = document.createElement('textarea');
    i.rows = 6;
    i.id = props.modalName + "_textarea_" + props.label;
    i.id = i.id.replace(/ /g, '').replace(/\?/g, '');
    l.for = i.id;
    if (props.autofocus != null) {
        autofocus = true;
    }
    i.autofocus = autofocus;
    i.setAttribute('class', 'modal_input');
    l.setAttribute('class', 'modal_label');
    i.type = props.type;
    var wrapper = document.createElement('div');
    wrapper.appendChild(i);
    wrapper.appendChild(l);
    wrapper.setAttribute('class', 'input_label_modal_wrapper');
    return wrapper;
}

function selectwithlabel(props) {
    var autofocus = false;
    var l = document.createElement('label');
    l.innerHTML = props.label;
    var s = document.createElement('select');
    s.id = props.modalName + "_select_" + props.label;
    s.id = s.id.replace(/ /g, '').replace(/\?/g, '');
    l.for = s.id;
    s.setAttribute('class', 'modal_input');
    // use ajax to populate options
    //TODO
    function populateOptions(label) {
        var what_to_get;
        if (label == "Distributor") {
            what_to_get = "distributors";
        }
        else if (label == "Manufacturer") {
            what_to_get = "manufacturers";
        }
        else if (label == "Job") {
            what_to_get = "jobs";
        }
        else if (label == "Customer") {
            what_to_get = "customers";
        }
        $.ajax({
            url: '/get' + what_to_get + '/',
            success: function (data) {
                for (let i = 0; i < data[what_to_get].length; i++) {
                    var o = document.createElement('option');
                    o.setAttribute('class', 'modal_input');
                    var op = JSON.parse(data[what_to_get][i]);
                    o.value = op.id;
                    o.id = op.id;
                    $(o).html(op.name);
                    s.append(o);
                }
            }
        });
    }

    populateOptions(props.label);
    l.setAttribute('class', 'modal_label');
    var wrapper = document.createElement('div');
    wrapper.appendChild(s);
    wrapper.appendChild(l);
    wrapper.setAttribute('class', 'input_label_modal_wrapper');
    return wrapper;
}

function checkboxwithLabel(props) {
    var autofocus = false;
    var l = document.createElement('label');
    l.innerHTML = props.label;
    var i = document.createElement('input');
    i.id = props.modalName + "_check_" + props.label;
    i.id = i.id.replace(' ', '').replace(/\?/g, '');
    l.for = i.id;
    i.type = props.type;
    if (props.autofocus != null) {
        autofocus = true;
    }
    i.autofocus = autofocus;
    i.setAttribute('class', 'modal_input');
    l.setAttribute('class', 'modal_label');
    var wrapper = document.createElement('div');
    wrapper.appendChild(i);
    wrapper.appendChild(l);
    wrapper.setAttribute('class', 'input_label_modal_wrapper');
    return wrapper;
}

function urgencyRatingWithLabel(props) {

    var ul = document.createElement('ul');
    ul.id = props.modalName + '_urgency_rating';
    ul.setAttribute('class', 'likert');
    for (var i = 0; i < 5; i++) {
        var li = document.createElement('li');
        var ip = document.createElement('input');
        ip.type = 'radio';
        ip.name = 'likert';
        ip.value = '' + (i + 1);
        var label = document.createElement('label');
        label.innerHTML = i + 1;
        li.appendChild(ip);
        li.appendChild(label);
        ul.appendChild(li);
    }

    var label = document.createElement('label');
    label.for = ul.id;
    label.innerHTML = props.label;
    ul.appendChild(label);
    return ul;

}

function addPart() {
    let name = $("#addPartModal_input_Name").val();
    let num = $("#addPartModal_input_PartNumber").val();
    let dist = $("#addPartModal_select_Distributor").val();
    let cost = $("#addPartModal_input_Cost").val();
    let man = $("#addPartModal_select_Manufacturer").val();
    let job = $("#addPartModal_select_Job").val();
    let still_need_part = !$("addPartModal_check_StillNeedPart").val();
    $.ajax({
        url: '/addNewPart/',
        type: 'POST',
        data: {
            name: name,
            num: num,
            dist: dist,
            man: man,
            cost: cost,
            job: job,
            still_need_part: still_need_part,
        },
        success: function (data) {
            // do nothing.
        }
    });
}


function addJob() {
    let requestor = $("#addJobModalBody_input_CustomerName").val();
    let date_submitted = $("#addJobModalBody_input_DateofRequest").val();
    let charge = $("#addJobModalBody_input_Charge").val();
    let descr = $("#addJobModalBody_textarea_Description").val();
    let machine = $("#addJobModalBody_input_Machine").val();
    let urg = $("#addJobModalBody_input_Urgency").val();
    let complete = $("#addJobModalBody_check_Complete").val();
    $.ajax({
        url: '/addNewJob/',
        type: 'POST',
        data: {
            requestor: requestor,
            date_submitted: date_submitted,
            charge: charge,
            descr: descr,
            machine: machine,
            urg: urg,
            complete: complete,
        }
    });
}

function addInvoice() {
    let customer = $("#addInvoiceModal_select_Customer").val();
    let date_of_invoice = $("#addInvoiceModal_input_DateofInvoice").val();
    let date_due = $("#addInvoiceModal_input_DateDue").val();
    let notes = $("#addInvoiceModal_textarea_Notes").val();
    $.ajax({
        url: '/addNewInvoice/',
        type: 'POST',
        data: {
            customer: customer,
            date_due: date_due,
            date_of_invoice: date_of_invoice,
            notes: notes
        },
        success: function (data) {
            location.reload();
        }
    });
}

function deleteInvoice(id) {
    $.ajax({
        url: '/deleteInvoice/',
        type: 'POST',
        data: {
            id: id
        },
        success: function (data) {
            location.reload();
        }
    });
}

function createlineitemstable(){
    var html = "<table style='width:100%;' border='0' cellspacing='0' cellpadding='0'>" +
        "<thead>" +
        "<tr>" +
        "<th width='5%'>#</th>" +
        "<th class='text-left'>DESCR</th>"+
        "<th class='text-right'>HOURLY RATE</th>" +
        "<th class='text-right'>HOURS</th>" +
        "<th class='text-right'>TOTAL</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody id='lineitemstablebody'>" +
        "</tbody>" +
        "<tfoot>" +
        "<tr>" +
        "<td colspan='4'>SUBTOTAL</td>" +
        "<td id='lineitems_subtotal'></td>" +
        "</tr>" +
        "<tr>" +
        "<td colspan='4'>TAX 25%</td>" +
        "<td id='tax25'></td>" +
        "</tr>" +
        "<tr>" +
        "<td colspan='4'>GRAND TOTAL</td>" +
        "<td id='grandtotal'></td>" +
        "</tr>" +
        "</tfoot>" +
        "</table>";
    return html;
}
function selectthisrow(){
    $("#lineitemstablebody.row_selected").removeClass('row_selected');
    // change this to selected colors,
    $(this).addClass('row_selected');
}
function deleteLineItem(id){
    $.ajax({
        url: '/deleteLineItem/',
        data: {'id': id},
        success: function(data){
            //TODO. Add the views function and url for this.
            // FIND THE ROW WITH A TD MATCHING THIS ID AND REMOVE IT. DON'T RELOAD. 
        }
    })
}
function addLineItem(invoice_id){
    $.ajax({
        url: '/addLineItem/',
        data: {'invoice_id': invoice_id},
        success: function(data){
            //TODO. Add the views function and url for this.
            var newlineitem = JSON.parse(data.newlineitem);
            $("#lineitemstablebody").append(
                '<tr onselect="selectthisrow();">' +
                '<td>' + newlineitem.id + '</td>'+
                '<td><input placeholder="Description" /></td>' +
                '<td><input placeholder="Hourly Rate" /></td>' +
                '<td><input placeholder="Hours"/></td>'+
                '<td><input placeholder="Total"/></td>' +
                '</tr>'
            )
        }
    })

}


function showEditInvoiceModal(id) {

    $.ajax({
        url: '/getInvoiceInfo/',
        type: 'POST',
        data: {id: id},
        success: function (data) {
            // put data in correct spots
            $("#editInvoiceModalBody").empty();
            var invoice = data;
            console.log(invoice);
            invoice = JSON.parse(data.invoice);
            console.log(invoice);
            var lineitems = [];
            for (var i = 0; i < invoice.lineitems.length; i++) {// list of strings, parse each of them and add to array
                lineitems.push(JSON.parse(invoice.lineitems[i]));
            }
            console.log(lineitems);
            $("#editInvoiceModalBody").html(
                "<div class='input_label_modal_wrapper'>" +
                "<select class='modal_input' id='editInvoice_modal_customer_input'>" +
                "<!-- populate with ajax -->" +
                "</select>" +
                "<label class='modal_label' for='editInvoice_modal_customer_input'>Customer</label>" +
                "</div>" +
                "<div id='line_item_table_container' class='input_label_modal_wrapper'></div>" +
                "<label class='modal_label' for='modal_line_items'>Line Items " +
                "<button onclick='addLineItem();' style='padding:5px; margin-left:5px; font-size:1em;line-height:1em;' class='btn btn-success'><i class='fa fa-plus'></i></button>" +
                "<button onclick='deleteLineItem();' style='padding:5px;margin-left:5px;  font-size:1em; line-height:1em;' class='btn btn-danger'><i class='fa fa-trash'></i></button>" +
                "</label>" +
                "</div>" +
                "" +
                "<div class='input_label_modal_wrapper'>" +
                "<input type='date'  class='modal_input'  id='editInvoice_modal_date_of_invoice_input'>" +
                "<label class='modal_label' for='editInvoice_modal_date_of_invoice_input'>Date of Invoice</label>" +
                "</div>" +
                "<div class='input_label_modal_wrapper'>" +
                "<input type='date' class='modal_input' id='editInvoice_modal_date_due_input'>" +
                "<label for='editInvoice_modal_date_due_input' class='modal_label'>Date Due</label>" +
                "</div>" +
                "</div>" +
                "<div class='modal-footer'>" +
                "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>" +
                "<button onclick='addInvoice();' type='button' class='btn btn-primary'>Add Invoice</button>" +
                "</div>"
            );

            var table = createlineitemstable();
            $("#line_item_table_container").html(table);

            $('#editInvoiceModalCenter').modal('show');
            var clist = data.customers;
            for (var i = 0; i < clist.length; i++) {
                var c = JSON.parse(clist[i]);
                $("#editInvoice_modal_customer_input").append('<option class="modal_input" value="' + c.id + '">' + c.name + '</option>');
            }

        }
    })

}