export interface Block {
  index: number;
  timestamp: string;
  data: AttendanceData;
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface AttendanceData {
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late';
  classId: string;
  className: string;
  departmentId: string;
  departmentName: string;
  markedBy: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  hod: string;
  createdAt: string;
  blockchain: Block[];
  isValid: boolean;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  departmentName: string;
  semester: number;
  section: string;
  studentCount: number;
  createdAt: string;
  blockchain: Block[];
  isValid: boolean;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  classId: string;
  className: string;
  departmentId: string;
  departmentName: string;
  createdAt: string;
  blockchain: Block[];
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  attendancePercentage: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  blockHash: string;
  blockIndex: number;
  timestamp: string;
}

export interface ValidationResult {
  isValid: boolean;
  invalidBlocks: number[];
  message: string;
}

export interface Stats {
  totalDepartments: number;
  totalClasses: number;
  totalStudents: number;
  totalAttendanceRecords: number;
  todayPresent: number;
  todayAbsent: number;
  todayLate: number;
  averageAttendance: number;
}

export const generateGenesisBlock = (_type: 'department' | 'class' | 'student'): Block => {
  return {
    index: 0,
    timestamp: new Date().toISOString(),
    data: {
      studentId: 'GENESIS',
      studentName: 'Genesis Block',
      status: 'present',
      classId: 'GENESIS',
      className: 'Genesis',
      departmentId: 'GENESIS',
      departmentName: 'Genesis',
      markedBy: 'System'
    },
    previousHash: '0',
    hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    nonce: 0
  };
};

export const calculateHash = (block: Block): string => {
  const data = `${block.index}${block.timestamp}${JSON.stringify(block.data)}${block.previousHash}${block.nonce}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
};

export const mineBlock = (block: Block, difficulty: number = 4): Block => {
  const prefix = '0'.repeat(difficulty);
  let nonce = 0;
  let hash = calculateHash({ ...block, nonce });
  
  while (!hash.startsWith('0x' + prefix)) {
    nonce++;
    hash = calculateHash({ ...block, nonce });
  }
  
  return { ...block, nonce, hash };
};

export const validateChain = (chain: Block[]): ValidationResult => {
  const invalidBlocks: number[] = [];
  
  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];
    
    const calculatedHash = calculateHash(currentBlock);
    if (currentBlock.hash !== calculatedHash) {
      invalidBlocks.push(i);
      continue;
    }
    
    if (currentBlock.previousHash !== previousBlock.hash) {
      invalidBlocks.push(i);
    }
  }
  
  return {
    isValid: invalidBlocks.length === 0,
    invalidBlocks,
    message: invalidBlocks.length === 0 
      ? 'Blockchain is valid' 
      : `Found ${invalidBlocks.length} invalid block(s)`
  };
};

export const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Computer Science',
    code: 'CS',
    description: 'Department of Computer Science and Engineering',
    hod: 'Dr. Sarah Johnson',
    createdAt: '2024-01-01T00:00:00.000Z',
    blockchain: [generateGenesisBlock('department')],
    isValid: true
  },
  {
    id: 'dept-2',
    name: 'Information Technology',
    code: 'IT',
    description: 'Department of Information Technology',
    hod: 'Dr. Michael Chen',
    createdAt: '2024-01-01T00:00:00.000Z',
    blockchain: [generateGenesisBlock('department')],
    isValid: true
  },
  {
    id: 'dept-3',
    name: 'Electronics & Communication',
    code: 'ECE',
    description: 'Department of Electronics and Communication Engineering',
    hod: 'Dr. Priya Sharma',
    createdAt: '2024-01-01T00:00:00.000Z',
    blockchain: [generateGenesisBlock('department')],
    isValid: true
  }
];

export const mockClasses: Class[] = [
  {
    id: 'class-1',
    name: 'CS-A Section',
    code: 'CS-A',
    departmentId: 'dept-1',
    departmentName: 'Computer Science',
    semester: 3,
    section: 'A',
    studentCount: 45,
    createdAt: '2024-01-15T00:00:00.000Z',
    blockchain: [generateGenesisBlock('class')],
    isValid: true
  },
  {
    id: 'class-2',
    name: 'CS-B Section',
    code: 'CS-B',
    departmentId: 'dept-1',
    departmentName: 'Computer Science',
    semester: 3,
    section: 'B',
    studentCount: 42,
    createdAt: '2024-01-15T00:00:00.000Z',
    blockchain: [generateGenesisBlock('class')],
    isValid: true
  },
  {
    id: 'class-3',
    name: 'IT-A Section',
    code: 'IT-A',
    departmentId: 'dept-2',
    departmentName: 'Information Technology',
    semester: 5,
    section: 'A',
    studentCount: 40,
    createdAt: '2024-01-15T00:00:00.000Z',
    blockchain: [generateGenesisBlock('class')],
    isValid: true
  }
];

export const mockStudents: Student[] = Array.from({ length: 20 }, (_, i) => ({
  id: `student-${i + 1}`,
  name: `Student ${i + 1}`,
  rollNumber: `2024CS${(i + 1).toString().padStart(3, '0')}`,
  email: `student${i + 1}@university.edu`,
  phone: `+1 (555) ${(100 + i).toString()}-${(1000 + i).toString()}`,
  classId: `class-${(i % 3) + 1}`,
  className: ['CS-A Section', 'CS-B Section', 'IT-A Section'][i % 3],
  departmentId: i < 15 ? 'dept-1' : 'dept-2',
  departmentName: i < 15 ? 'Computer Science' : 'Information Technology',
  createdAt: '2024-02-01T00:00:00.000Z',
  blockchain: [generateGenesisBlock('student')],
  totalPresent: Math.floor(Math.random() * 80) + 20,
  totalAbsent: Math.floor(Math.random() * 10),
  totalLate: Math.floor(Math.random() * 5),
  attendancePercentage: Math.floor(Math.random() * 30) + 70
}));
