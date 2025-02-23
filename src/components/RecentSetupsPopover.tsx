// src/components/RecentSetupsPopover.tsx
import React, { useState, useEffect, useRef } from 'react';
import type { FlightLeg } from '@/types/flight';

interface SavedSetup {
  id: string;
  timestamp: string;
  firstLegDeparture: string;
  firstLegDate: string;
  customerName: string;
  flightLegs: FlightLeg[];
  comment: string;
}

interface RecentSetupsPopoverProps {
  onSetupSelect: (setup: SavedSetup) => void;
}

const RecentSetupsPopover: React.FC<RecentSetupsPopoverProps> = ({ onSetupSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSetups, setRecentSetups] = useState<SavedSetup[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      const storedSetups = localStorage.getItem('recent_flight_setups');
      if (storedSetups) {
        const { setups } = JSON.parse(storedSetups);
        setRecentSetups(setups);
      }
    } catch (error) {
      console.error('Error loading recent setups:', error);
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="relative" ref={popoverRef}>
<button
  onClick={() => setIsOpen(!isOpen)}
  className="p-1 hover:bg-gray-50 rounded-full"
>
  <img 
    src="/icons/recent-setup-icon.svg" 
    alt="Recent setups"
    className="w-8 h-8"
  />
</button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
          <div className="p-4 space-y-2">
            <h3 className="font-medium text-sm text-gray-900">Recent Flight Setups</h3>
            {recentSetups.length === 0 ? (
              <p className="text-sm text-gray-500">No recent setups found</p>
            ) : (
              recentSetups.map((setup) => (
                <button
                  key={setup.id}
                  onClick={() => {
                    onSetupSelect(setup);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="text-sm text-gray-900">
                    From {setup.firstLegDeparture} on {formatDate(setup.firstLegDate)}
                  </div>
                  {setup.customerName && (
                    <div className="text-xs text-gray-500">
                      Customer: {setup.customerName}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    Generated at {formatTime(setup.timestamp)}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentSetupsPopover;