function inputwithlabel(props){
        var autofocus = false;
        var l = document.createElement('label');
        l.innerHTML = props.label;
        var i = document.createElement('input');
        i.id = props.modalName + "_input_" + props.label;
        l.for = i.id;
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
    function selectwithlabel(props){
        var autofocus = false;
        var l = document.createElement('label');
        l.innerHTML = props.label;
        var s = document.createElement('select');
        s.id = props.modalName + "_select_" + props.label;
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