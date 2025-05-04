import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const TimetableContext = createContext()

export const useTimetable = () => {
  const context = useContext(TimetableContext)
  if (!context) {
    throw new Error('useTimetable must be used within a TimetableProvider')
  }
  return context
}

export const TimetableProvider = ({ children }) => {
  const [timetableData, setTimetableData] = useState([])
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDay, setSelectedDay] = useState('All Days')

  const validateEntry = useCallback((entry) => {
    // Check required fields
    if (!entry.subject || !entry.teacher || !entry.day || !entry.time) {
      throw new Error('Missing required fields');
    }

    // Check for conflicts
    const hasConflict = timetableData.some(
      existing => 
        existing.id !== entry.id &&
        existing.day === entry.day && 
        existing.time === entry.time
    );

    if (hasConflict) {
      throw new Error('Time slot is already occupied');
    }

    // Check teacher availability
    const hasTeacherConflict = timetableData.some(
      existing =>
        existing.id !== entry.id &&
        existing.day === entry.day &&
        existing.time === entry.time &&
        existing.teacher === entry.teacher
    );

    if (hasTeacherConflict) {
      throw new Error('Teacher is already scheduled for this time');
    }

    return true;
  }, [timetableData]);

  const addEntry = useCallback((entry) => {
    try {
      validateEntry(entry);
      setTimetableData(prev => [...prev, { ...entry, id: Date.now() }]);
      return true;
    } catch (error) {
      console.error('Error adding entry:', error);
      return false;
    }
  }, [validateEntry]);

  const updateEntry = useCallback((id, updatedEntry) => {
    try {
      validateEntry(updatedEntry);
      setTimetableData(prev => 
        prev.map(entry => entry.id === id ? updatedEntry : entry)
      );
      return true;
    } catch (error) {
      console.error('Error updating entry:', error);
      return false;
    }
  }, [validateEntry]);

  // Add persistence
  useEffect(() => {
    const savedData = localStorage.getItem('timetableData');
    if (savedData) {
      try {
        setTimetableData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timetableData', JSON.stringify(timetableData));
  }, [timetableData]);

  const deleteEntry = useCallback((id) => {
    setTimetableData(prev => prev.filter(entry => entry.id !== id))
  }, [])

  const importData = useCallback((data) => {
    setTimetableData(data.timetable || [])
    setTeachers(data.teachers || [])
    setSubjects(data.subjects || [])
  }, [])

  const exportData = useCallback(() => {
    return {
      timetable: timetableData,
      teachers,
      subjects
    }
  }, [timetableData, teachers, subjects])

  const value = {
    timetableData,
    teachers,
    subjects,
    searchTerm,
    selectedDay,
    setSearchTerm,
    setSelectedDay,
    addEntry,
    updateEntry,
    deleteEntry,
    importData,
    exportData,
    validateEntry
  }

  return (
    <TimetableContext.Provider value={value}>
      {children}
    </TimetableContext.Provider>
  )
}