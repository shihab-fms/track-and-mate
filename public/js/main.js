import axios from 'axios';

const clientForm = document.querySelector('.client-info-form');
const retrunClientForm = document.querySelector('.client-info-return');

if (clientForm) {
  const client = JSON.parse(localStorage.getItem('clientData'));
  if (client) {
    window.setTimeout(() => {
      const time = new Date(Date.now());
      if (
        !(
          time.getTime() - 60 * 5 * 1000 >
          new Date(client.location[0].coords.resultTime).getTime()
        )
      )
        return location.assign('/thanks');
    }, 500);
  }
  const btnsumbit = document.querySelector('.btn-start');

  btnsumbit.addEventListener('click', function (e) {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    let lat, long;
    const locations = [];

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        lat = position.coords.latitude;
        long = position.coords.longitude;

        // Now you can use lat and long here or call a function passing lat and long as arguments
        // console.log('Latitude:', lat);
        // console.log('Longitude:', long);

        //pushing lacation
        locations.push({
          coords: {
            resultTime: new Date(Date.now()),
            lat,
            long,
          },
        });

        //updating api
        try {
          const res = await axios({
            method: 'POST',
            url: `/api/v1/clients/create`,
            data: {
              name,
              location: locations,
            },
          });

          if (res.data.status === 'success') {
            console.log('ok');
            localStorage.clear();
            localStorage.setItem('clientData', JSON.stringify(res.data.data));
            window.setTimeout(() => {
              location.assign('/thanks');
            }, 1500);
          }
        } catch (err) {
          // console.log(err);
        }
      });
    }
  });
}

if (retrunClientForm) {
  const client = JSON.parse(localStorage.getItem('clientData'));
  const messagebox = document.querySelector('.message');
  console.log(client.name);
  messagebox.textContent = `Welcome...! You have been caughten ${client.name}`;
}
