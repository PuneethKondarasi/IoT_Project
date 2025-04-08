from flask import Flask, jsonify
from flask_cors import CORS
import serial
import threading

app = Flask(__name__)
CORS(app)

# Set your COM port here (like 'COM3' for Windows or '/dev/ttyUSB0' for Linux)
SERIAL_PORT = 'COM4'
BAUD_RATE = 9600

latest_data = {"temperature": 0, "humidity": 0, "soilMoisture": 0}

def read_serial():
    global latest_data
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE)
        print(f"✅ Connected to Arduino on {SERIAL_PORT}")
        while True:
            try:
                line = ser.readline().decode('utf-8').strip()
                if line:
                    parts = line.split(',')
                    if len(parts) == 3:
                        temperature, humidity, soilMoisture = parts
                        if temperature != "NaN":
                            latest_data = {
                                "temperature": float(temperature),
                                "humidity": float(humidity),
                                "soilMoisture": int(soilMoisture)
                            }
                            print("📡 Latest Sensor Data:", latest_data)
            except Exception as e:
                print(f"⚠️ Error reading serial: {e}")
    except serial.SerialException:
        print(f"🚫 Could not open serial port {SERIAL_PORT}. Make sure your Arduino is connected.")

@app.route('/sensor-data', methods=['GET'])
def get_sensor_data():
    return jsonify(latest_data)

if __name__ == '__main__':
    threading.Thread(target=read_serial, daemon=True).start()
    app.run(host="0.0.0.0", port=5000)
