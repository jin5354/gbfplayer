import GameDataStore from '../stores/GameDataStore';

let notification = {
    apMaxHandler(ap) {
        new Notification('Apmax!', { body: `now ap = ${ap}`, icon: 'assets/icon.png' });
    },
    bpMaxHandler(bp) {
        new Notification('Bpmax!', { body: `now bp = ${bp}`, icon: 'assets/icon.png' });
    },
    addApBpMaxEvent() {
        GameDataStore.addEventListener('ApMax', this.apMaxHandler);
        GameDataStore.addEventListener('BpMax', this.bpMaxHandler);
    },
    removeApBpMaxEvent() {
        GameDataStore.removeEventListener('ApMax', this.apMaxHandler);
        GameDataStore.removeEventListener('BpMax', this.bpMaxHandler);
    },
    init() {
        Notification.requestPermission();
        this.addApBpMaxEvent();
    },
    uninit() {
        this.removeApBpMaxEvent();
    }
};

export default notification;