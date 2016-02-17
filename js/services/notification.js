import AppDispatcher from '../dispatcher/AppDispatcher';
import GameDataStore from '../stores/GameDataStore';

let notification = {
    init() {
        Notification.requestPermission();
        GameDataStore.addEventListener('ApMax', (ap) => {
            new Notification('Apmax!', { body: `now ap = ${ap}`, icon: 'assets/icon.png' });
        });
        GameDataStore.addEventListener('BpMax', (bp) => {
            new Notification('Bpmax!', { body: `now bp = ${bp}`, icon: 'assets/icon.png' });
        });
    }
};

export default notification;