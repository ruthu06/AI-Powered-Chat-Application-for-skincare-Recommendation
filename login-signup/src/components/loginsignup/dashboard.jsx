import React, { useState ,useRef } from 'react';
import { useNavigate } from 'react-router-dom';

 
const Dashboard = ({ name }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Define state for authentication // Define state for user name
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false); // Toggle quiz visibility
  const [formData, setFormData] = useState({
    skinType: '',
    concerns: '',
    age: ''
  });
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const responseRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState(''); 
  const[showchat,setShowChat]=useState(false);
  React.useEffect(() => {
    if (quizData) {
      setMessages([{ role: 'assistant', content: quizData }]);
    }
  }, [quizData]);
  const handlechat = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/dashboard/message/${name}`);
      const data = await response.json(); // Need to parse JSON with fetch
      
      if (data.success) {
        
        setMessages(data.data||[]); 
        setShowChat(true);
        responseRef.current.scrollIntoView({ behavior: 'smooth' });
      } else {
        
        setMessages([]); 
      }
      setShowChat(true);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
};
const handleSubmit = async () => {
  if (!userInput.trim()) return;

  const newMessages = [...messages, { role: 'user', content: userInput }];
  setMessages(newMessages);
  setUserInput(''); 

  try {
      const response = await fetch('/dashboard/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();
      console.log('API RESPONSE', data);

      if (data && data.reply) {
          const assistantMessage = {
              role: 'assistant',
              content: String(data.reply)
          };
          const updatedMessages = [...newMessages, assistantMessage];
          setMessages(updatedMessages);
          // Save messages only once with both user and assistant messages
          saveMessages(name, updatedMessages);
      } else {
          console.error('Invalid response format:', data);
          const updatedMessages = [...newMessages, { 
              role: 'assistant', 
              content: 'Sorry, I encountered an error processing your request.' 
          }];
          setMessages(updatedMessages);
          saveMessages(name, updatedMessages);
      }
  } catch (error) {
      console.error('Error fetching response:', error);
      const updatedMessages = [...newMessages, { 
          role: 'assistant', 
          content: 'Sorry, an error occurred while processing your request.' 
      }];
      setMessages(updatedMessages);
      saveMessages(name, updatedMessages);
  }
};
const saveMessages = async (name, messages) => {
  try {
      console.log('entered');
      await fetch('/dashboard/message/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, messages: messages.map(msg => ({ role: msg.role, content: msg.content })) }), 
      });
      console.log('Messages saved successfully');
  } catch (error) {
      console.error('Error saving messages:', error);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlequiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      await new Promise(resolve => setTimeout(resolve, 60000));
      const data = await response.json();
      
      if (data.error) {
        alert(data.error);
        setLoading(false);
        return;
      }

      console.log('Received Quiz Data:', data);
      setQuizData(data.routine);
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get skincare routine');
    } finally {
      setLoading(false);
    }
  };
const handleclearchat = async () => {
  try {
    const response = await fetch(`/dashboard/messages/clear/${name}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setMessages([]); // Clear local chat state
    } else {
      console.error('Failed to clear messages:', response.statusText);
    }
  } catch (error) {
    console.error('Error clearing messages:', error);
  }
};
const handleLogout = async () => {
  try {
    const response = await fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      setIsAuthenticated(false);

      navigate('/');
    } else {
      console.error('Failed to log out:', response.statusText);
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
};


  return (
    <div style={{width: '100%', minHeight: '100vh', position: 'absolute', background: '#FFC8DD',margin:0}}>
      {/* Header */}
      <div
        style={{
          width: '580px',
          height: '144px',
          position: 'absolute',
          top: '79px',
          left: '89px',
          color: 'black',
          fontSize: '80px',
          fontFamily: 'Italiana',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        Your skincare routine personalised
      </div>

      {/* Flex container for the image or quiz form */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '160px',
          position: 'relative',
          top: '1px',
        }}
      >
        {!showQuiz ? (
          // Image displayed initially
          <img src={`/images/cosmetics.jpg/`} style={{ width: '400px', height: '500px', marginRight: '100px' }} alt="Cosmetics" />

            
        ) : (
          <form
            // onSubmit={handleSubmit}
            style={{
              width: '400px',
              height: '500px',
              marginRight: '100px',
              background: '#CDB4DB',
              padding: '20px',
              borderRadius: '15px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 style={{ textAlign: 'center',fontFamily: 'Jacques Francois' }}>Tell us about your skin</h2>
            <div style={{ marginBottom: '10px' , padding: '10px', width: '80%',fontFamily: 'Jacques Francois'}}>
              <label>Skin Type:</label>
              <select
                name="skinType"
                value={formData.skinType}
                onChange={handleInputChange}
                style={{ margin: '10px', padding: '10px', width: '80%',fontFamily: 'Jacques Francois' }}
              >
                <option value="">Select</option>
                <option value="Oily">Oily</option>
                <option value="Dry">Dry</option>
                <option value="Combination">Combination</option>
                <option value="Sensitive">Sensitive</option>
              </select>
            </div>
            <div style={{ marginBottom: '10px' , padding: '10px', width: '80%',fontFamily: 'Jacques Francois'}}>
              <label>Concerns:</label>
              <input
                type="text"
                name="concerns"
                value={formData.concerns}
                onChange={handleInputChange}
                placeholder="E.g., Acne, Uneven Skin Tone"
                style={{ margin: '10px', padding: '10px', width: '80%',fontFamily: 'Jacques Francois' }}
              />
            </div>
            <div style={{ marginBottom: '10px', padding: '10px', width: '80%',fontFamily: 'Jacques Francois' }}>
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                style={{ margin: '10px', padding: '10px', width: '80%' ,fontFamily: 'Jacques Francois'}}
              />
            </div>
          </form>
        )}
      </div>

      {/* Take Quiz button */}
      {!showQuiz ? (
        <div>
        <div
          onClick={() => setShowQuiz(true)}
          style={{
            width: '400px',
            height: '109px',
            position: 'absolute',
            top: '457px',
            left: '73px',
            background: '#CDB4DB',
            borderRadius: '50px',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '365px',
              height: '61px',
              position: 'absolute',
              color: 'black',
              fontSize: '50px',
              fontFamily: 'Jacques Francois',
              fontWeight: '300',
              wordWrap: 'break-word',
              textAlign: 'center',
              lineHeight: '109px',
            }}
          >
            Take Quiz
            
          </div>

        </div>
        <div
          onClick={handlechat}
          style={{
            width: '400px',
            height: '109px',
            position: 'absolute',
            top: '587px',
            left: '73px',
            background: '#CDB4DB',
            borderRadius: '50px',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '365px',
              height: '61px',
              position: 'absolute',
              color: 'black',
              fontSize: '50px',
              fontFamily: 'Jacques Francois',
              fontWeight: '300',
              wordWrap: 'break-word',
              textAlign: 'center',
              lineHeight: '109px',
            }}
          >
            Let's Chat
            </div>
            </div>
        </div>
      ):(<div
        onClick={handlequiz}
        style={{
          width: '400px',
          height: '109px',
          position: 'absolute',
          top: '500px',
          left: '73px',
          background: '#CDB4DB',
          borderRadius: '50px',
          cursor: 'pointer',
          zIndex: 20,
        }}
      >
        <div
          style={{
            width: '365px',
            height: '61px',
            position: 'absolute',
            color: 'black',
            fontSize: '50px',
            fontFamily: 'Jacques Francois',
            fontWeight: '400',
            wordWrap: 'break-word',
            textAlign: 'center',
            lineHeight: '109px',
          }}
        >
          Submit
        </div>
      </div>)}

      {/* Greeting */}
      <div
        style={{
          position:'fixed',
          width: '298px',
          height: '60px',
          position: 'absolute',
          top: '0',
          right: '50px',
          color: 'black',
          fontSize: '50px',
          fontFamily: 'Jacques Francois',
          fontWeight: '400',
          wordWrap: 'break-word',
          cursor: 'pointer'
        }}
      >
        Hi, {name}
      </div>
      {(quizData||showchat) && (
  <div
    ref={responseRef}
    style={{
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      background: '#FFC8DD',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {/* Title */}
    <div
      style={{
        color: 'black',
        fontSize: '50px',
        fontFamily: 'Italiana',
        fontWeight: '300',
        textAlign: 'center',
        Top: '1.8',
      }}
    >
      Your skincare routine personalised
    </div>

    {/* Greeting for quiz results page */}
    {/* <div
      style={{
        width: '298px',
        height: '60px',
        position: 'absolute',
        top: '0',
        right: '50px',
        color: 'black',
        fontSize: '50px',
        fontFamily: 'Jacques Francois',
        fontWeight: '400',
        wordWrap: 'break-word',
      }}
    >
      Hi, {name}
    </div> */}

    {/* Routine data container */}
    <div
      style={{
        width: '1027px',
        background: '#CDB4DB',
        borderRadius: '50px',
        padding: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minheight: '60vh',
        height:'fit-content',
      }}
    >

      {/* Chat input section */}
      <div
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a question about your skincare..."
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            fontFamily: 'Jacques Francois',
            borderRadius: '25px',
            border: '1px solid #ccc',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            fontSize: '14px',
            fontFamily: 'Jacques Francois',
            borderRadius: '25px',
            background: '#CDB4DB',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
        <button
          onClick={handleclearchat}
          style={{
            marginTop: '10px',
            padding: '20px 30px',
            fontSize: '14px',
            fontFamily: 'Jacques Francois',
            borderRadius: '25px',
            background: '#CDB4DB',
            border: 'none',
            cursor: 'pointer',
          }} >
          clear chat
        </button>

      </div>

      {/* Chat messages */}
    
      <div
        style={{
          width: '100%',
          background: '#F5F5F5',
          borderRadius: '50px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: 'fit-content',
          overflow:'auto',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? '#CDB4DB' : '#F5F5F5',
              borderRadius: '20px',
              padding: '10px 15px',
              margin: '5px 0',
              maxWidth: '80%',
              wordWrap: 'break-word',
              color: 'black',
              fontFamily: 'Jacques Francois',
              fontSize: '14px',
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  </div> 
)}
    
    <div style={{  position: 'fixed', 
    top: '10px',       
    right: '10px',     
    display: 'flex',   
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',}}>
        <img
          src="/images/logout.webp" 
          alt="log-out"
          style={{ width: '40px', height: '40px', cursor: 'pointer' }}
          onClick={handleLogout}
        />
      </div>

    </div>
  );
};

export default Dashboard;
