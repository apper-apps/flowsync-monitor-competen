import React from 'react';

const SettingsSection = ({ title, description, children }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

export default SettingsSection;