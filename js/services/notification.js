import AppDispatcher from '../dispatcher/AppDispatcher';
import GameDataStore from '../stores/GameDataStore';

let notification = {
    apMaxHandler(ap) {
        new Notification('Apmax!', { body: `now ap = ${ap}`, icon: 'assets/icon.png' });
    },
    bpMaxHandler(bp) {
        new Notification('Bpmax!', { body: `now bp = ${bp}`, icon: 'assets/icon.png' });
    },
    init(options) {
        Notification.requestPermission();
        GameDataStore.addEventListener('ApMax', this.apMaxHandler);
        GameDataStore.addEventListener('BpMax', this.bpMaxHandler);
    }
};

export default notification;