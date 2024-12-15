import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SuggestionForm = () => {
    const [errorType, setErrorType] = useState('');
    const [category, setCategory] = useState('');
    const [supportiveLink, setSupportiveLink] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [errorScenarios, setErrorScenarios] = useState([]);

    // Fetch all suggestions
    const fetchSuggestions = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/errorSuggestions');
            setSuggestions(response.data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    // Error scenarios to select from
    const scenarios = [
        { type: 'Error', categories: [
            'Array index out of bounds', 'Dereferencing null pointer', 'Memory leak', 
            'Division by zero', 'Double free', 'Modifying const variable', 
            'Buffer overflow', 'Use of uninitialized pointer', 'Unreachable code',
            'Resource leak', 'Invalid pointer access', 'Use after free'
        ]},
        { type: 'Warning', categories: [
            'Uninitialized variable', 'Suspicious usage of sizeof', 
            'Implicit conversion loss of precision', 'Missing return statement', 
            'Unused parameter', 'Unused function', 'Redundant condition', 
            'Suspicious comparison'
        ]},
        { type: 'Style', categories: [
            'Variable shadowing', 'Unnecessary pointer dereference', 
            'Redundant code', 'Unreachable break statement', 'Redundant return statement'
        ]},
        { type: 'Performance', categories: [
            'Inefficient container use', 'Unnecessary heap allocation', 
            'Redundant function call', 'Unnecessary copying of variable'
        ]},
        { type: 'Portability', categories: [
            '64-bit portability issue', 'Usage of deprecated function', 
            'Non-portable pointer size', 'Endianness issue'
        ]},
        { type: 'Information', categories: [
            'Template recursion limit reached', 'Inconclusive analysis', 
            'Configuration problem', 'Possible template instantiation overflow'
        ]}
    ];


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Update existing suggestion
                await axios.put(`http://localhost:5001/api/errorSuggestions/${editingId}`, {
                    errorType,
                    category,
                    supportiveLink
                });
            } else {
                // Create new suggestion
                await axios.post('http://localhost:5001/api/errorSuggestions', {
                    errorType,
                    category,
                    supportiveLink
                });
            }
            resetForm();
            fetchSuggestions();
        } catch (error) {
            console.error("Error submitting suggestion:", error);
        }
    };

    const handleEdit = (suggestion) => {
        setErrorType(suggestion.errorType);
        setCategory(suggestion.category);
        setSupportiveLink(suggestion.supportiveLink);
        setEditingId(suggestion._id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/errorSuggestions/${id}`);
            fetchSuggestions();
        } catch (error) {
            console.error("Error deleting suggestion:", error);
        }
    };

    const resetForm = () => {
        setErrorType('');
        setCategory('');
        setSupportiveLink('');
        setEditingId(null);
        setErrorScenarios([]);
    };

    const handleTypeChange = (e) => {
        setErrorType(e.target.value);
        const selectedScenario = scenarios.find(scenario => scenario.type === e.target.value);
        setErrorScenarios(selectedScenario ? selectedScenario.categories : []);
        setCategory(''); // Reset category when changing error type
    };

    // Group suggestions by errorType
    const groupedSuggestions = suggestions.reduce((grouped, suggestion) => {
        const { errorType } = suggestion;
        if (!grouped[errorType]) {
            grouped[errorType] = [];
        }
        grouped[errorType].push(suggestion);
        return grouped;
    }, {});

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    border: '1px solid #ccc',
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                    marginBottom: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', color: '#333' }}>
                    {editingId ? 'Edit' : 'Submit'} Suggestion
                </h2>
                <div style={{ marginBottom: '15px' }}>
                    <label
                        htmlFor="errorType"
                        style={{ display: 'block', marginBottom: '5px', fontSize: '16px', color: '#555' }}
                    >
                        Error Type:
                    </label>
                    <select
                        id="errorType"
                        value={errorType}
                        onChange={handleTypeChange}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px',
                        }}
                    >
                        <option value="">Select Error Type</option>
                        <option value="Error">Error</option>
                        <option value="Warning">Warning</option>
                        <option value="Performance">Performance</option>
                        <option value="Portability">Portability</option>
                        <option value="Information">Information</option>
                    </select>
                </div>
                {errorType && (
                    <div style={{ marginBottom: '15px' }}>
                        <label
                            htmlFor="category"
                            style={{ display: 'block', marginBottom: '5px', fontSize: '16px', color: '#555' }}
                        >
                            Category:
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '16px',
                            }}
                        >
                            <option value="">Select Category</option>
                            {errorScenarios.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div style={{ marginBottom: '15px' }}>
                    <label
                        htmlFor="supportiveLink"
                        style={{ display: 'block', marginBottom: '5px', fontSize: '16px', color: '#555' }}
                    >
                        Supportive Link:
                    </label>
                    <input
                        type="url"
                        id="supportiveLink"
                        value={supportiveLink}
                        onChange={(e) => setSupportiveLink(e.target.value)}
                        placeholder="https://example.com"
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px',
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '12px 15px',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        fontSize: '16px',
                        cursor: 'pointer',
                        width: '100%',
                    }}
                >
                    {editingId ? 'Update Suggestion' : 'Submit Suggestion'}
                </button>
            </form>

            {/* Grouped Suggestions Table */}
            <h3 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '22px', color: '#333' }}>All Suggestions Grouped by Error Type</h3>
            {Object.keys(groupedSuggestions).map((errorType) => (
                <div key={errorType} style={{ marginBottom: '20px' }}>
                    <h4
                        style={{
                            backgroundColor: '#f1f1f1',
                            padding: '10px',
                            borderRadius: '4px',
                            fontSize: '18px',
                            color: '#555',
                        }}
                    >
                        {errorType}
                    </h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f5f5f5', fontSize: '16px' }}>Category</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f5f5f5', fontSize: '16px' }}>Supportive Link</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f5f5f5', fontSize: '16px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedSuggestions[errorType].map((suggestion) => (
                                <tr key={suggestion._id}>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', fontSize: '15px' }}>{suggestion.category}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', fontSize: '15px' }}>
                                        <a href={suggestion.supportiveLink} target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF' }}>
                                            {suggestion.supportiveLink}
                                        </a>
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                        <button
                                            onClick={() => handleEdit(suggestion)}
                                            style={{
                                                marginRight: '10px',
                                                padding: '6px 10px',
                                                cursor: 'pointer',
                                                border: 'none',
                                                backgroundColor: '#28a745',
                                                color: '#fff',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(suggestion._id)}
                                            style={{
                                                padding: '6px 10px',
                                                cursor: 'pointer',
                                                border: 'none',
                                                backgroundColor: '#dc3545',
                                                color: '#fff',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default SuggestionForm;
