import noble from 'noble';
import { BluetoothHciSocket } from '@abandonware/bluetooth-hci-socket';

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  console.log('Peripheral found:', peripheral.advertisement.localName);

  if (peripheral.advertisement.localName === 'ZY306') {
    peripheral.connect(function(error) {
      if (error) {
        console.error('Erreur de connexion :', error);
        return;
      }

      console.log('Connecté à', peripheral.advertisement.localName);

      peripheral.discoverSomeServicesAndCharacteristics(
        ['battery_service'],
        ['battery_level'],
        function(error, services, characteristics) {
          if (error) {
            console.error('Erreur de découverte :', error);
            return;
          }

          const characteristic = characteristics[0];
          characteristic.write(Buffer.from('Hello, World!'), false, function(error) {
            if (error) {
              console.error('Erreur d\'écriture :', error);
            } else {
              console.log('Données envoyées avec succès!');
            }
          });
        }
      );
    });
  }
});
