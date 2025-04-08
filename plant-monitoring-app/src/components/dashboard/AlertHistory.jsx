const AlertsHistory = ({ alerts }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold text-white mb-3">Alert History</h3>
      {alerts.length === 0 ? (
        <p className="text-gray-400">No alerts triggered.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {alerts.map((alert, index) => (
            <li
              key={index}
              className="bg-gray-700 text-sm text-white p-2 rounded-md shadow-sm"
            >
              {alert}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertsHistory;
