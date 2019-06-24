function inputwithlabel(props){
        var autofocus = false;
        var l = document.createElement('label');
        l.innerHTML = props.label;
        var i = document.createElement('input');
        i.id = props.modalName + "_input_" + props.label;
        i.id = i.id.replace(/ /g,'').replace(/\?/g,'');
        l.for = i.id;
        if (props.autofocus != null){
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
function textfieldwithlabel(props){
        var autofocus = false;
        var l = document.createElement('label');
        l.innerHTML = props.label;
        var i = document.createElement('textarea');
        i.rows = 6;
        i.id = props.modalName + "_textarea_" + props.label;
        i.id = i.id.replace(/ /g,'').replace(/\?/g,'');
        l.for = i.id;
        if (props.autofocus != null){
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
function selectwithlabel(props){
    var autofocus = false;
    var l = document.createElement('label');
    l.innerHTML = props.label;
    var s = document.createElement('select');
    s.id = props.modalName + "_select_" + props.label;
    s.id = s.id.replace(/ /g, '').replace(/\?/g,'');
    l.for = s.id;
    s.setAttribute('class','modal_input');
    // use ajax to populate options
    //TODO
    function populateOptions(label){
        var what_to_get;
        if (label == "Distributor") {
            what_to_get = "distributors";
        }
        else if (label == "Manufacturer"){
            what_to_get = "manufacturers";
        }
        else if (label == "Job"){
            what_to_get = "jobs";
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

function checkboxwithLabel(props){
    var autofocus = false;
    var l = document.createElement('label');
    l.innerHTML = props.label;
    var i = document.createElement('input');
    i.id = props.modalName + "_check_" + props.label;
    i.id = i.id.replace(' ','').replace(/\?/g,'');
    l.for = i.id;
    i.type = props.type;
    if (props.autofocus != null){
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

function urgencyRatingWithLabel(props){

    var ul = document.createElement('ul');
    ul.id = props.modalName + '_urgency_rating';
    ul.setAttribute('class','likert');
    for (var i = 0; i < 5; i ++){
        var li = document.createElement('li');
        var ip = document.createElement('input');
        ip.type = 'radio';
        ip.name = 'likert';
        ip.value = '' + (i + 1) ;
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

function addPart(){
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


function addJob(){
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
    })
}