class BluetoothPrinter {
  constructor() {
    this.device = null;
    this.server = null;
    this.service = null;
    this.characteristic = null;
  }

  // Connexion à l'imprimante Bluetooth
  connect() {
    console.log('Demande de périphérique Bluetooth...');
    return navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'] // Service d'impression
    })
      .then((device) => {
        console.log('Appareil détecté:', device);
        if (device.name !== 'Printer001') {
          console.log('Cet appareil n\'est pas celui que vous voulez utiliser.');
          return 'Appareil non autorisé';
        }
        this.device = device;
        return device.gatt.connect();
      })
      .then((server) => {
        this.server = server;
        return server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
      })
      .then((service) => {
        this.service = service;
        return service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');
      })
      .then((characteristic) => {
        this.characteristic = characteristic;
        console.log('Connexion réussie à l\'imprimante!');
        return characteristic;
      })
      .catch((error) => {
        console.error('Erreur de connexion Bluetooth:', error);
      });
  }

  // Méthode pour imprimer du texte avec configuration de la table de caractères
  printText(text) {
    if (!this.characteristic) {
      console.error('Impossible d\'imprimer, pas de caractéristique disponible.');
      return;
    }

    // Envoyer d'abord la commande pour sélectionner la table de codes (ici CP858)
    const setCodePageCommand = new Uint8Array([0x1B, 0x74, 0x12]);
    this.characteristic.writeValueWithoutResponse(setCodePageCommand)
      .then(() => {
        // Une fois la table de caractères configurée, on prépare le texte.
        // Remplacer \n par le saut de ligne ESC/POS (\x0A)
        const textWithLineBreaks = text.replace(/\n/g, '\x0A');

        // Convertir le texte en bytes (UTF-8 par défaut)
        const textCommand = new TextEncoder().encode(textWithLineBreaks);

        // Crée le tableau final d'octets avec un saut de ligne supplémentaire à la fin
        const dataToSend = new Uint8Array([...textCommand, 0x0A]);

        console.log('Données à envoyer:', dataToSend);

        // Fonction pour envoyer les données en morceaux adaptés
        const sendChunks = (data, chunkSize = 50) => {
          let index = 0;
          const sendNextChunk = () => {
            if (index < data.length) {
              const chunk = data.slice(index, index + chunkSize);
              index += chunkSize;
              console.log(`Envoi du morceau (index: ${index}, taille: ${chunk.length})`);
              this.characteristic.writeValueWithoutResponse(chunk)
                .then(() => {
                  console.log(`Morceau envoyé (index: ${index})`);
                  sendNextChunk();
                })
                .catch((error) => {
                  console.error('Erreur lors de l\'envoi du morceau:', error);
                });
            } else {
              console.log('Toutes les données ont été envoyées');
            }
          };
          sendNextChunk();
        };

        // Envoi des données textuelles en morceaux
        sendChunks(dataToSend);
      })
      .catch((error) => {
        console.error('Erreur lors de la configuration de la table de caractères:', error);
      });
  }

  // Vérifier si l'imprimante est connectée
  isPrinterConnected() {
    const connected = localStorage.getItem('printerConnected');
    return connected === 'true';
  }

  // Récupérer le nom de l'appareil depuis le localStorage
  getDeviceName() {
    const deviceName = localStorage.getItem('bluetoothDeviceName');
    return deviceName;
  }
}

export default BluetoothPrinter;
