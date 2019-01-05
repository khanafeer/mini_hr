$( document ).ready(function (){
    get_render_employees();
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
   });
   
    });


var employee_id = 0
var month_num = 1

$(document).on('shown.bs.modal','#jobs_tbl_modal',function (event){
    var button = $(event.relatedTarget)
    employee_id =  button.data('empid')
    get_render_jobs(employee_id)
});

$(document).on('shown.bs.modal','#deductions_modal',function (event){
    var button = $(event.relatedTarget)
    employee_id =  button.data('empid')
});

$(document).on('shown.bs.modal','#earnings_modal',function (event){
    var button = $(event.relatedTarget)
    employee_id =  button.data('empid')
});

$(document).on('shown.bs.modal','#report_modal',function (event){
    var button = $(event.relatedTarget)
    employee_id =  button.data('empid')
    get_emp_slip()
});

$(document).on('shown.bs.modal','#taxex_table_modal',get_render_taxes);
$(document).on('click','#job_add_btn',add_job);
$(document).on('click','#deduct_add_btn',add_deduction);
$(document).on('click','#earn_add_btn',add_earning);
$(document).on('click','#tax_add_btn',add_tax);
$(document).on('click','#save_close_btn',function(){add_employee(true)})
$(document).on('click','#save_only_btn',function(){add_employee(false)})
$(document).on('click','#export_btn',export_employees)
$(document).on('click','#send_mail',send_mail)



function objectifyForm(formArray) {//serialize data function

  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}

function add_employee(close){
    var formArray = document.getElementById('employee_form')
    var data = objectifyForm(formArray)
    $.post('/api/employees/',data,function(data,status){
    if (status == "success"){
        for (var i = 0; i < formArray.length; i++){
            $('#employee_form').find('input[name="'+formArray[i]['name']+'"]').val("")
            }
        if (close == true){$('#employee_modal').modal('toggle')}
         get_render_employees()
    }
    else{
        alert(data)
    }
    }).fail(function(data) {
        alert(data.responseText)
  })
    

}

function add_job(){
    description = $('#id_describtion').val()
    $.post('/api/jops/',{"description": description,"employee": employee_id},function(data,status){if (status == 'success'){get_render_jobs(employee_id)}}	)
    $('#id_describtion').val(' ')
}

function add_deduction(){
    amount = $('#id_amount_d').val()
    description = $('#id_description_d').val()
    $.post('/api/deductions/',{"employee":employee_id,"description": description,"amount": amount})
    $('#id_description_d').val(' ')
    $('#id_amount_d').val(' ')
}

function add_tax(){
    var value = $('#tax_form').find('input[name="value"]').val();
    var from = $('#tax_form').find('input[name="range_start"]').val();
    var to = $('#tax_form').find('input[name="range_end"]').val();

    $.post('/api/taxes/',{"value":value,"range_start": from,"range_end": to})
    $('#tax_form').find('input[name="value"]').val(" ")
    $('#tax_form').find('input[name="range_start"]').val(" ")
    $('#tax_form').find('input[name="range_end"]').val(" ");
    get_render_taxes()
    $('#taxes_modal').modal('toggle')
}

function add_earning(){
    amount = $('#id_amount').val()
    description = $('#id_description').val()
    $.post('/api/earnings/',{"employee":employee_id,"description": description,"amount": amount}	)
    $('#id_description').val(' ')
    $('#id_amount').val(' ')
}

function export_employees(){
    $.ajax({
        url: '/export_employee/',
        type: 'GET',
        success: function() {
            window.location = '/export_employee/';
        }
});
}
function get_render_jobs (emp_id){
    $.getJSON("/api/emp_jobs/"+emp_id+"/", function(data, status)
    {

        var new_body = ""
        var x = 1;
        $.each(data, function(i, item) {
            var row = "<tr id='"+item.id+"'>"
            row += "<td>"+ x++ +"</td>"
            row += "<td>" + item.description + "</td>"
            row += "<td>"+ item.date +"</td>"
            row += "<td><button class='btn btn-primary delete_btn' onclick='delete_job("+item.id+")' type='submit'><i class='fa fa-trash-alt fa-sm pull-right'></i></button></td>"
            row += "</tr>"
            new_body += row
        });
        $("#jobs_table_body tbody").html(new_body)
    }
    );
}

function compute_age(date_of_birth){
    dob = new Date(date_of_birth);
    var today = new Date();
    var age = Math.floor((today-dob) / (365.25 * 24 * 60 * 60 * 1000));
    return age
}

function get_render_employees(){
    $.getJSON("/api/employees/", function(data, status)
    {
        var new_body = ""
        var x = 1;
        $.each(data, function(i, item) {
            var row = "<tr id='"+item.id+"'>"
            row += "<td>"+ x++ +"</td>"
            row += "<td>" + item.first_name + " " + item.middle_name + " " + item.last_name + "</td>"
            row += "<td>"+ item.national_id +"</td>"
            row += "<td>"+ item.job_position +"</td>"
            row += "<td>"+ item.date_of_birth +"</td>"
            row += "<td>"+ compute_age(item.date_of_birth) +"</td>"
            row += "<td>"+ item.place_of_birth +"</td>"
            row += "<td>"+ item.country +"</td>"
            row += "<td>"+ item.nationality +"</td>"
            row += "<td>"+ item.martial_status +"</td>"
            row += "<td>"+ item.gender +"</td>"
            row += "<td>"+ item.main_salary +"</td>"
            row += "<td><button class='btn btn-primary delete_btn block' onclick='delete_function("+item.id+")' type='submit'><i class='fa fa-trash-alt fa-sm pull-right'></i></button></td>"
            row += "<td><button class='btn btn-primary report_btn block' data-toggle='modal' data-target='#report_modal' data-empid='"+item.id+"'  type='submit'><i class='fa fa-chart-line fa-sm'></i></button></td>"
            row += "<td><button class='btn btn-primary earnings_btn block' data-toggle='modal' data-target='#earnings_modal' data-empid='"+item.id+"' type='submit'><i class='fa fa-dollar-sign fa-sm'></i></button></td>"
            row += "<td><button class='btn btn-primary deductions_btn block' data-toggle='modal' data-target='#deductions_modal' data-empid='"+item.id+"' type='submit'><i class='fa fa-sort-numeric-down fa-sm'></i></button></td>"
            row += "<td><button class='btn btn-primary jobs_btn block' data-toggle='modal' data-target='#jobs_tbl_modal' data-empid='"+item.id+"' type='submit'><i class='fa fa-business-time fa-sm'></i></button></td>"
            row += "</tr>"
            new_body += row
        });
        $("#emp_table_body tbody").html(new_body)
    }
  );
}

function get_emp_slip(){
    $.getJSON("/api/emp_totals/"+employee_id+"/"+month_num+"/", function(data_j, status)
    {  var data = JSON.parse(data_j)
        $('#main_salary').html(data['main_salary'])
        $('#deductions').html(data['total_deductions'])
        $('#earnings').html(data['total_earnings'])
        $('#total_salary').html(data['total_salary'])
        $('#net_salary').html(data['net_salary'])
       var new_body = ""
        var x = 1;
        $.each(data['earnings'], function(i, item) {
            var row = "<tr id='"+item.id+"'>"
            row += "<td>"+ x++ +"</td>"
            row += "<td>" + item.amount + "</td>"
            row += "<td>"+ item.description +"</td>"
            row += "<td>"+ item.date +"</td>"
            row += "</tr>"
            new_body += row
        });
        $("#earnings_table_body tbody").html(new_body)


        var new_body_2 = ""
        var x = 1;
        $.each(data['deductions'], function(i, item) {
            var row = "<tr id='"+item.id+"'>"
            row += "<td>"+ x++ +"</td>"
            row += "<td>" + item.amount + "</td>"
            row += "<td>"+ item.description +"</td>"
            row += "<td>"+ item.date +"</td>"
            row += "</tr>"
            new_body_2 += row
        });
        $("#deductions_table_body tbody").html(new_body_2)


    }
  );
}

function get_render_taxes(){
    $.getJSON("/api/taxes/", function(data, status)
    {
        var new_body = ""
        var x = 1;
        $.each(data, function(i, item) {
            var row = "<tr id='"+item.id+"'>"
            row += "<td>"+ x++ +"</td>"
            row += "<td>" + item.value + " %" + "</td>"
            row += "<td>"+ item.range_start +"</td>"
            row += "<td>"+ item.range_end +"</td>"
            row += "<td><button class='btn btn-primary delete_btn' onclick='delete_tax("+item.id+")' type='submit'><i class='fa fa-trash-alt fa-sm pull-right'></i> delete</button></td>"
            row += "</tr>"
            new_body += row
        });
        $("#tax_table_body tbody").html(new_body)
    }
  );
}

function delete_function(emp_id){
    var r = confirm("Are you sure you want to delete employee ?");
    if (r == true)
     {
             $.ajax({
            url: '/api/employees/'+emp_id+'/',
            type: 'DELETE',
            success: function(result) {
                get_render_employees()
                },
            error : function(result) {
                alert("Not allowed to delete this employee, Delete employee jobs first")
                }

     })}}

function delete_tax(tax_id){
    var r = confirm("Are you sure you want to delete the tax?");
    if (r == true)
     {
              $.ajax({
            url: '/api/taxes/'+tax_id+'/',
            type: 'DELETE',
            success: function(result) {
                get_render_taxes()
                }
});
     }

}

function delete_job(itm_id){
    var r = confirm("Are you sure you want to delete the job?");
    if (r == true)
     {
      $.ajax({
            url: '/api/jops/'+itm_id+'/',
            type: 'DELETE',
            success: function(result) {
                get_render_jobs(employee_id)
                }
});
     }

}

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("emp_table_body");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function filter_table() {
  // Declare variables
  var radioValue = $("input[name='radio_group']:checked").attr("id").replace('elm_','');

  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("search_input");
  filter = input.value.toUpperCase();
  table = document.getElementById("emp_table_body");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[radioValue];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function send_mail(){
    var mail = $('#mail_input').val()
    $.get('/api/send_slip_mail/'+employee_id+'/'+mail+'/',function(data,status){
        console.log(data)
        if (data=='200'){
            alert("mail sent successfully")
            $('#report_modal').modal('toggle')
        }
        else{
            alert('enter a valid email address')
        }
    })
}