import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState({ level: null, charging: false });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 1. Digital Clock Effect (Interval with cleanup)
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId); // Cleanup function
  }, []); // Runs once on mount

  // 2. Battery Status Effect
  useEffect(() => {
    let batteryManager;

    const updateBattery = (b) => {
      setBattery({
        level: b.level * 100,
        charging: b.charging,
      });
    };

    if ('getBattery' in navigator) {
      navigator.getBattery().then((b) => {
        batteryManager = b;
        updateBattery(batteryManager);

        batteryManager.addEventListener('levelchange', () => updateBattery(batteryManager));
        batteryManager.addEventListener('chargingchange', () => updateBattery(batteryManager));
      });
    }

    // Cleanup function
    return () => {
      if (batteryManager) {
        batteryManager.removeEventListener('levelchange', () => updateBattery(batteryManager));
        batteryManager.removeEventListener('chargingchange', () => updateBattery(batteryManager));
      }
    };
  }, []);

  // 3. Online/Offline Status Effect
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="dashboard">
      <h1>System Dashboard</h1>
      <p className="subtitle">React <code>useEffect</code> Demonstration</p>
      
      <div className="grid">
        {/* Clock Card */}
        <div className="card">
          <div className="card-header">
            <span className="icon">🕒</span>
            <h2>Live Clock</h2>
          </div>
          <div className="value clock">
            {time.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>

        {/* Battery Card */}
        <div className="card">
          <div className="card-header">
            <span className="icon">🔋</span>
            <h2>Battery</h2>
          </div>
          <div className="value">
            {battery.level !== null ? (
              <div className="battery-info">
                <span>{Math.round(battery.level)}%</span>
                {battery.charging && <span className="charging" title="Charging">⚡</span>}
              </div>
            ) : (
              <span className="not-supported">Not Supported</span>
            )}
          </div>
        </div>

        {/* Network Status Card */}
        <div className="card">
          <div className="card-header">
            <span className="icon">🌐</span>
            <h2>Network</h2>
          </div>
          <div className={`value status ${isOnline ? 'online' : 'offline'}`}>
            <span className="status-dot"></span>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
