import Topbar from "../general/Topbar";
import '../../styles/dashboard.css';
import SelectInput from "../Inputs/SelectInput";
import { useState, useEffect } from "react";
import TaskList from "../cards/TaskList";
import { Task } from "../cards/TaskCard";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLoader } from "../Providers/LoaderProvider";
import { GoPeople } from "react-icons/go";
import AddPeopleModal from "../Modals/AddPeopleModal";
import PersonAddedModal from "../Modals/PersonAddedModal";

const Dashboard = () => {
  const [filterOption, setFilterOption] = useState('week');
  const [todo, setTodo] = useState<Task[]>([]);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [backlog, setBacklog] = useState<Task[]>([]);
  const [done, setDone] = useState<Task[]>([]);
  const [isAddPeopleModalOpen,setIsAddPeopleModalOpen] = useState(false)
  const [isPersonAddedModalOpen,setIsPersonAddedModalOpen] = useState(false)
  const [emailAdded,setEmailAdded]=useState('')
  const navigate = useNavigate();
  const { setIsLoading } = useLoader();
  const options = [
    { label: 'Today', value: 'today' },
    { label: 'This week', value: 'week' },
    { label: 'This Month', value: 'month' },
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/tasks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          params: {
            filter: filterOption,
          },
        });

        if (response.data.success) {
          const tasks = response.data.data;

          setTodo(tasks.todo);
          setInProgress(tasks.inprogress);
          setBacklog(tasks.backlog);
          setDone(tasks.done);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [filterOption, navigate, setIsLoading]);

  return (
    <>
      {isPersonAddedModalOpen && 
        <PersonAddedModal 
          isOpen={isPersonAddedModalOpen}
          onClose={()=>setIsPersonAddedModalOpen(false)}
          email={emailAdded}
        />
      }
      {isAddPeopleModalOpen &&
        <AddPeopleModal 
          isOpen={isAddPeopleModalOpen} 
          onClose={()=>setIsAddPeopleModalOpen(false)}
          onSuccess={(email:string)=>{
            setIsAddPeopleModalOpen(false)
            setEmailAdded(email)
            setIsPersonAddedModalOpen(true)
          }}
        />
      }
      <Topbar />
      <div className="flex justify-between align-center">
        <div className="flex align-center gap-16" onClick={()=>setIsAddPeopleModalOpen(true)} >
          <h2>Board</h2>
          <div className='add-people-button flex align-center gap-4'>
            <GoPeople />
            <p>Add People</p>
          </div>
        </div>
        <div className="filter">
          <SelectInput options={options} onChange={(value: string) => setFilterOption(value)} />
        </div>
      </div>
      <div className="flex dashboard-container">
        <TaskList tasklist={backlog} title="Backlog" type="backlog" />
        <TaskList tasklist={todo} title="To Do" type="todo" />
        <TaskList tasklist={inProgress} title="In Progress" type="inprogress" />
        <TaskList tasklist={done} title="Done" type="done" />
      </div>
    </>
  );
};

export default Dashboard;
