import type { ReactNode } from 'react';
import { createContext, useContext, useReducer, useEffect } from 'react';
import type { Department, Class, Student, Block, AttendanceData } from '@/lib/blockchain';
import { generateGenesisBlock, mineBlock } from '@/lib/blockchain';
import toast from 'react-hot-toast';

interface AppState {
  departments: Department[];
  classes: Class[];
  students: Student[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_DEPARTMENT'; payload: Department }
  | { type: 'UPDATE_DEPARTMENT'; payload: Department }
  | { type: 'DELETE_DEPARTMENT'; payload: string }
  | { type: 'ADD_CLASS'; payload: Class }
  | { type: 'UPDATE_CLASS'; payload: Class }
  | { type: 'DELETE_CLASS'; payload: string }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'DELETE_STUDENT'; payload: string }
  | { type: 'ADD_ATTENDANCE_BLOCK'; payload: { studentId: string; data: AttendanceData } }
  | { type: 'INIT_DATA'; payload: { departments: Department[]; classes: Class[]; students: Student[] } };

const initialState: AppState = {
  departments: [],
  classes: [],
  students: [],
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'INIT_DATA':
      return {
        ...state,
        departments: action.payload.departments,
        classes: action.payload.classes,
        students: action.payload.students,
      };
    
    case 'ADD_DEPARTMENT':
      return {
        ...state,
        departments: [...state.departments, action.payload],
      };
    
    case 'UPDATE_DEPARTMENT':
      return {
        ...state,
        departments: state.departments.map(dept =>
          dept.id === action.payload.id ? action.payload : dept
        ),
      };
    
    case 'DELETE_DEPARTMENT':
      return {
        ...state,
        departments: state.departments.filter(dept => dept.id !== action.payload),
        classes: state.classes.filter(cls => cls.departmentId !== action.payload),
        students: state.students.filter(student => student.departmentId !== action.payload),
      };
    
    case 'ADD_CLASS':
      return {
        ...state,
        classes: [...state.classes, action.payload],
      };
    
    case 'UPDATE_CLASS':
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.id ? action.payload : cls
        ),
      };
    
    case 'DELETE_CLASS':
      return {
        ...state,
        classes: state.classes.filter(cls => cls.id !== action.payload),
        students: state.students.filter(student => student.classId !== action.payload),
      };
    
    case 'ADD_STUDENT':
      return {
        ...state,
        students: [...state.students, action.payload],
        classes: state.classes.map(cls =>
          cls.id === action.payload.classId
            ? { ...cls, studentCount: cls.studentCount + 1 }
            : cls
        ),
      };
    
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(student =>
          student.id === action.payload.id ? action.payload : student
        ),
      };
    
    case 'DELETE_STUDENT':
      const studentToDelete = state.students.find(s => s.id === action.payload);
      return {
        ...state,
        students: state.students.filter(student => student.id !== action.payload),
        classes: studentToDelete
          ? state.classes.map(cls =>
              cls.id === studentToDelete.classId
                ? { ...cls, studentCount: Math.max(0, cls.studentCount - 1) }
                : cls
            )
          : state.classes,
      };
    
    case 'ADD_ATTENDANCE_BLOCK':
      return {
        ...state,
        students: state.students.map(student => {
          if (student.id === action.payload.studentId) {
            const previousBlock = student.blockchain[student.blockchain.length - 1];
            const newBlock: Block = {
              index: student.blockchain.length,
              timestamp: new Date().toISOString(),
              data: action.payload.data,
              previousHash: previousBlock.hash,
              hash: '',
              nonce: 0,
            };
            const minedBlock = mineBlock(newBlock, 4);
            
            // Update attendance stats
            const stats = {
              present: action.payload.data.status === 'present' ? student.totalPresent + 1 : student.totalPresent,
              absent: action.payload.data.status === 'absent' ? student.totalAbsent + 1 : student.totalAbsent,
              late: action.payload.data.status === 'late' ? student.totalLate + 1 : student.totalLate,
            };
            const total = stats.present + stats.absent + stats.late;
            const percentage = total > 0 ? Math.round((stats.present / total) * 100) : 0;
            
            return {
              ...student,
              blockchain: [...student.blockchain, minedBlock],
              totalPresent: stats.present,
              totalAbsent: stats.absent,
              totalLate: stats.late,
              attendancePercentage: percentage,
            };
          }
          return student;
        }),
      };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Department actions
  addDepartment: (dept: Omit<Department, 'id' | 'createdAt' | 'blockchain' | 'isValid'>) => Promise<void>;
  updateDepartment: (id: string, dept: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  // Class actions
  addClass: (cls: Omit<Class, 'id' | 'createdAt' | 'blockchain' | 'isValid' | 'studentCount'>) => Promise<void>;
  updateClass: (id: string, cls: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  // Student actions
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'blockchain' | 'totalPresent' | 'totalAbsent' | 'totalLate' | 'attendancePercentage'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  // Attendance actions
  markAttendance: (studentId: string, data: AttendanceData) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize with mock data
  useEffect(() => {
    const initData = () => {
      const departments: Department[] = [
        {
          id: 'dept-1',
          name: 'Computer Science',
          code: 'CS',
          description: 'Department of Computer Science and Engineering',
          hod: 'Dr. Sarah Johnson',
          createdAt: new Date().toISOString(),
          blockchain: [generateGenesisBlock('department')],
          isValid: true,
        },
        {
          id: 'dept-2',
          name: 'Information Technology',
          code: 'IT',
          description: 'Department of Information Technology',
          hod: 'Dr. Michael Chen',
          createdAt: new Date().toISOString(),
          blockchain: [generateGenesisBlock('department')],
          isValid: true,
        },
        {
          id: 'dept-3',
          name: 'Electronics & Communication',
          code: 'ECE',
          description: 'Department of Electronics and Communication Engineering',
          hod: 'Dr. Priya Sharma',
          createdAt: new Date().toISOString(),
          blockchain: [generateGenesisBlock('department')],
          isValid: true,
        },
      ];

      const classes: Class[] = [
        {
          id: 'class-1',
          name: 'Data Structures',
          code: 'CS-A',
          departmentId: 'dept-1',
          departmentName: 'Computer Science',
          semester: 3,
          section: 'A',
          studentCount: 0,
          createdAt: new Date().toISOString(),
          blockchain: [generateGenesisBlock('class')],
          isValid: true,
        },
        {
          id: 'class-2',
          name: 'Algorithms',
          code: 'CS-B',
          departmentId: 'dept-1',
          departmentName: 'Computer Science',
          semester: 3,
          section: 'B',
          studentCount: 0,
          createdAt: new Date().toISOString(),
          blockchain: [generateGenesisBlock('class')],
          isValid: true,
        },
        {
          id: 'class-3',
          name: 'Web Development',
          code: 'IT-A',
          departmentId: 'dept-2',
          departmentName: 'Information Technology',
          semester: 5,
          section: 'A',
          studentCount: 0,
          createdAt: new Date().toISOString(),
          blockchain: [generateGenesisBlock('class')],
          isValid: true,
        },
      ];

      const students: Student[] = Array.from({ length: 15 }, (_, i) => ({
        id: `student-${i + 1}`,
        name: `Student ${i + 1}`,
        rollNumber: `2024CS${(i + 1).toString().padStart(3, '0')}`,
        email: `student${i + 1}@university.edu`,
        phone: `+1 (555) ${(100 + i).toString()}-${(1000 + i).toString()}`,
        classId: `class-${(i % 3) + 1}`,
        className: ['Data Structures', 'Algorithms', 'Web Development'][i % 3],
        departmentId: i < 10 ? 'dept-1' : 'dept-2',
        departmentName: i < 10 ? 'Computer Science' : 'Information Technology',
        createdAt: new Date().toISOString(),
        blockchain: [generateGenesisBlock('student')],
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        attendancePercentage: 0,
      }));

      // Update student counts
      const updatedClasses = classes.map(cls => ({
        ...cls,
        studentCount: students.filter(s => s.classId === cls.id).length,
      }));

      dispatch({ type: 'INIT_DATA', payload: { departments, classes: updatedClasses, students } });
    };

    initData();
  }, []);

  // Department actions
  const addDepartment = async (dept: Omit<Department, 'id' | 'createdAt' | 'blockchain' | 'isValid'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      const newDept: Department = {
        ...dept,
        id: `dept-${Date.now()}`,
        createdAt: new Date().toISOString(),
        blockchain: [generateGenesisBlock('department')],
        isValid: true,
      };
      
      dispatch({ type: 'ADD_DEPARTMENT', payload: newDept });
      toast.success('Department added to blockchain! 🎉');
    } catch (error) {
      toast.error('Failed to add department');
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add department' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateDepartment = async (id: string, updates: Partial<Department>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const existing = state.departments.find(d => d.id === id);
      if (existing) {
        dispatch({ type: 'UPDATE_DEPARTMENT', payload: { ...existing, ...updates } });
        toast.success('Department updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update department');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteDepartment = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      dispatch({ type: 'DELETE_DEPARTMENT', payload: id });
      toast.success('Department removed from blockchain!');
    } catch (error) {
      toast.error('Failed to delete department');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Class actions
  const addClass = async (cls: Omit<Class, 'id' | 'createdAt' | 'blockchain' | 'isValid' | 'studentCount'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newClass: Class = {
        ...cls,
        id: `class-${Date.now()}`,
        createdAt: new Date().toISOString(),
        blockchain: [generateGenesisBlock('class')],
        isValid: true,
        studentCount: 0,
      };
      
      dispatch({ type: 'ADD_CLASS', payload: newClass });
      toast.success('Class added to blockchain! 🎉');
    } catch (error) {
      toast.error('Failed to add class');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateClass = async (id: string, updates: Partial<Class>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const existing = state.classes.find(c => c.id === id);
      if (existing) {
        dispatch({ type: 'UPDATE_CLASS', payload: { ...existing, ...updates } });
        toast.success('Class updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update class');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteClass = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      dispatch({ type: 'DELETE_CLASS', payload: id });
      toast.success('Class removed from blockchain!');
    } catch (error) {
      toast.error('Failed to delete class');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Student actions
  const addStudent = async (student: Omit<Student, 'id' | 'createdAt' | 'blockchain' | 'totalPresent' | 'totalAbsent' | 'totalLate' | 'attendancePercentage'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStudent: Student = {
        ...student,
        id: `student-${Date.now()}`,
        createdAt: new Date().toISOString(),
        blockchain: [generateGenesisBlock('student')],
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        attendancePercentage: 0,
      };
      
      dispatch({ type: 'ADD_STUDENT', payload: newStudent });
      toast.success('Student added to blockchain! 🎉');
    } catch (error) {
      toast.error('Failed to add student');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const existing = state.students.find(s => s.id === id);
      if (existing) {
        dispatch({ type: 'UPDATE_STUDENT', payload: { ...existing, ...updates } });
        toast.success('Student updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update student');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteStudent = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      dispatch({ type: 'DELETE_STUDENT', payload: id });
      toast.success('Student removed from blockchain!');
    } catch (error) {
      toast.error('Failed to delete student');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Attendance actions
  const markAttendance = async (studentId: string, data: AttendanceData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate mining
      dispatch({ type: 'ADD_ATTENDANCE_BLOCK', payload: { studentId, data } });
      toast.success('Attendance recorded on blockchain! 🎉');
    } catch (error) {
      toast.error('Failed to record attendance');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value: AppContextType = {
    state,
    dispatch,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addClass,
    updateClass,
    deleteClass,
    addStudent,
    updateStudent,
    deleteStudent,
    markAttendance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
