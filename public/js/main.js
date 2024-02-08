import axios from 'axios';

const clientForm = document.querySelector('.client-info-form');

if (clientForm) {
  const btnsumbit = document.querySelector('.btn-start');

  btnsumbit.addEventListener('click', function (e) {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    let lat, long;
    const location = [];

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        lat = position.coords.latitude;
        long = position.coords.longitude;

        // Now you can use lat and long here or call a function passing lat and long as arguments
        console.log('Latitude:', lat);
        console.log('Longitude:', long);

        //pushing lacation
        location.push({
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
            url: `http://127.0.0.1:3001/api/v1/clients/create`,
            data: {
              name,
              location,
            },
          });

          if (res.data.status === 'success') {
            console.log('Ok');
          }
        } catch (err) {
          console.log(err);
        }
      });
    }
  });
}
