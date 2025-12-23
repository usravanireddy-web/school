import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Chip,
  IconButton,
  Button,
  InputAdornment,
  Avatar,
  Stack,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

/* ================= TYPES ================= */

type StudentStatus = "Active" | "Inactive" | "Graduated" | "Suspended";
type Grade = "9th" | "10th" | "11th" | "12th";
type Section = "A" | "B" | "C" | "D";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: Grade;
  section: Section;
  attendance: number;
  gpa: number;
  status: StudentStatus;
}

/* ================= MOCK DATA ================= */

const generateStudents = (): Student[] =>
  Array.from({ length: 50 }, (_, i) => ({
    id: `STU${1000 + i}`,
    firstName: "John",
    lastName: `Doe${i}`,
    email: `john${i}@school.edu`,
    grade: ["9th", "10th", "11th", "12th"][i % 4] as Grade,
    section: ["A", "B", "C", "D"][i % 4] as Section,
    attendance: 70 + (i % 30),
    gpa: Number((2 + Math.random() * 2).toFixed(2)),
    status: ["Active", "Inactive", "Graduated", "Suspended"][i % 4] as StudentStatus,
  }));

/* ================= COMPONENT ================= */

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setStudents(generateStudents());
  }, []);

  const filteredStudents = useMemo(
    () =>
      students.filter(s =>
        `${s.firstName} ${s.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [students, search]
  );

  const paginated = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Student Management
        </Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />}>
          Add Student
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>GPA</TableCell>
              <TableCell>Attendance</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map(student => (
              <TableRow key={student.id} hover>
                <TableCell>{student.id}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <Avatar>{student.firstName[0]}</Avatar>
                    <Box>
                      <Typography>
                        {student.firstName} {student.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.email}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  {student.grade} - {student.section}
                </TableCell>
                <TableCell>
                  <Chip label={student.status} size="small" />
                </TableCell>
                <TableCell>{student.gpa}</TableCell>
                <TableCell>{student.attendance}%</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() =>
                      navigate(`/admin/students/${student.id}`)
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredStudents.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={e =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
      />
    </Box>
  );
};

export default StudentsPage;
