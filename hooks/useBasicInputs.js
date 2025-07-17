"use client"
import { useState, useEffect } from 'react';

const useBasicInputs = () => {
  const [basicInputs, setBasicInputs] = useState({
    wakeUpTime: '',
    meditationDuration: '',
    timeWastedRandomly: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateTimeFormat = (timeStr) => {
    if (!timeStr) return true;
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(timeStr);
  };

  const handleBasicInputChange = (field, value) => {
    if (value.length <= 5) {
      if (value.length === 2 && !value.includes(':')) {
        value += ':';
      }
      setBasicInputs(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleBasicInputSubmit = async () => {
    try {
      const invalid = Object.entries(basicInputs).filter(
        ([, v]) => v && !validateTimeFormat(v)
      );

      if (invalid.length > 0) {
        throw new Error('Please enter time in HH:MM format');
      }

      setLoading(true);
      const res = await fetch('/api/basic-inputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basicInputs)
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Failed to save basic inputs');

      setBasicInputs({ wakeUpTime: '', meditationDuration: '', timeWastedRandomly: '' });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInputs = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/basic-inputs');
        if (!res.ok) throw new Error('Failed to fetch basic inputs');
        const data = await res.json();
        setBasicInputs({
          wakeUpTime: data.wakeUpTime || '',
          meditationDuration: data.meditationDuration || '',
          timeWastedRandomly: data.timeWastedRandomly || ''
        });
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInputs();
  }, []);

  return {
    basicInputs,
    handleBasicInputChange,
    handleBasicInputSubmit,
    loading,
    error
  };
};

export default useBasicInputs;
