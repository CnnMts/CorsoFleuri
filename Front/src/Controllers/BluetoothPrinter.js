class BluetoothPrinter {
  constructor() {
    this.device = null;
    this.server = null;
    this.service = null;
    this.characteristic = null;
  }

  // Connexion à l'imprimante Bluetooth
  async connect() {
    try {
      console.log('Demande de périphérique Bluetooth...');
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
      });

      console.log('Appareil détecté:', this.device);
      const server = await this.device.gatt.connect();
      this.service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
      this.characteristic = await this.service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

      console.log('Connexion réussie à l\'imprimante!');
      return this.characteristic;
    } catch (error) {
      console.error('Erreur de connexion Bluetooth:', error);
    }
  }

  // Remplace les caractères spéciaux pour la compatibilité ESC/POS en CP858
  replaceSpecialChars(text) {
    const charMap = {
      é: 0x82,
      è: 0x8A,
      ê: 0x88,
      ë: 0x89,
      à: 0x85,
      â: 0x83,
      ä: 0x84,
      ç: 0x87,
      ô: 0x93,
      ö: 0x94,
      ù: 0x97,
      û: 0x96,
      ü: 0x81
    };

    return Uint8Array.from([...text].map((char) => charMap[char] || char.charCodeAt(0)));
  }

  async printText(text) {
    if (!this.characteristic) {
      console.error('Impossible d\'imprimer, pas de caractéristique disponible.');
      return;
    }
    const setCodePageCommand = new Uint8Array([0x1B, 0x74, 0x13]);

    const formattedText = this.replaceSpecialChars(text);
    const dataToSend = new Uint8Array([...setCodePageCommand, ...formattedText, 0x0A]);

    console.log('Données à envoyer:', dataToSend);

    await this.sendChunks(dataToSend);
  }

  async sendChunks(data, chunkSize = 50) {
    let index = 0;
    while (index < data.length) {
      const chunk = data.slice(index, index + chunkSize);
      index += chunkSize;
      try {
        await this.characteristic.writeValueWithoutResponse(chunk);
        console.log(`Morceau envoyé (index: ${index})`);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du morceau:', error);
      }
    }
    console.log('Toutes les données ont été envoyées');
  }
}

export default BluetoothPrinter;
