document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek,dayGridMonth'
    },
    editable: true,
    selectable: true,
    allDaySlot:false,
    slotDuration: '01:00:00',
    events: async function(fetchInfo, successCallback, failureCallback) {
      try {
        const response = await fetch('http://192.168.1.142:8000/owner/reservations/all/future');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const reservations = await response.json();
        const events = reservations.map(reservation => ({
          title: reservation.name,
          start: reservation.startTime, // assuming the start time property name is 'startTime'
          end: reservation.endTime, // assuming the end time property name is 'endTime'
          fieldId: reservation.fieldId // assuming the field ID property name is 'fieldId'
        }));
        successCallback(events);
      } catch (error) {
        failureCallback('There was an error while fetching events!');
      }
    }, // Initialize with an empty events array
    select: function(info) {
      // Open the modal
      document.getElementById('eventModal').style.display = 'block';
      // Set the start and end time in the hidden inputs
      document.getElementById('eventStart').value = info.startStr;
      document.getElementById('eventEnd').value = info.endStr;
    },
    eventClick: function(info) {
      alert('Event: ' + info.event.title);
      info.jsEvent.preventDefault(); // prevent browser from following link in href
    }
  });

  calendar.render();

  // Get modal elements
  var modal = document.getElementById('eventModal');
  var span = document.getElementsByClassName('close')[0];

  // Handle save button click in the modal
  document.getElementById('saveEvent').onclick = function() {
    var title = document.getElementById('eventTitle').value;
    var start = document.getElementById('eventStart').value;
    var end = document.getElementById('eventEnd').value;

    if (title) {
      calendar.addEvent({
        title: title,
        start: start,
        end: end
      });
      // Close the modal
      modal.style.display = 'none';
      // Reset the form
      document.getElementById('eventForm').reset();
    } else {
      alert('Event title is required');
    }
  };

  // Close the modal when the user clicks on <span> (x)
  span.onclick = function() {
    modal.style.display = 'none';
  };

  // Close the modal when the user clicks anywhere outside of the modal
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
});