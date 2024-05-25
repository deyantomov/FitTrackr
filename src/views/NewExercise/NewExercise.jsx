import { useState } from 'react';
import { createNewExercise } from '../../api/api';
import { useApp } from '../../hooks/useApp';
import { LockClosedIcon, ClockIcon, ChartBarIcon, PencilIcon, DocumentTextIcon } from '@heroicons/react/16/solid';

const NewExerciseForm = () => {
    const app = useApp();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('beginner');
    const [duration, setDuration] = useState(0);
    const [isPrivate, setIsPrivate] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setError('');
        setSuccess('');
    
        if (!validateForm()) {
            return;
        }
    
        if (app.currentUser) {
            const exercise = {
                title,
                description,
                level,
                duration,
                isPrivate
            };
            try {
                console.log(await createNewExercise(app, exercise));
                setSuccess('Exercise created successfully!');
                resetForm();
            } catch (error) {
                setError('Failed to create exercise. Please try again.');
                console.error("Error creating new exercise:", error);
            }
        } else {
            setError('You must be logged in to create an exercise.');
        }
    };

    const validateForm = () => {
        if (!title || title.length < 4 || title.length > 30) {
            setError('Title must be between 4 and 30 characters.');
            return false;
        }
        if (!description) {
            setError('Description is required.');
            return false;
        }
        if (!level) {
            setError('Level is required.');
            return false;
        }
        if (isNaN(duration) || duration < 0) {
            setError('Duration must be a non-negative number.');
            return false;
        }
        setError('');
        return true;
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setLevel('beginner');
        setDuration(0);
        setIsPrivate(false);
    };

    return (
        <div className="flex justify-center">
            <div className="form-control w-auto md:w-1/2 lg:w-1/3 mx-auto p-4 bg-base-200 rounded-box">
                <form onSubmit={handleSubmit}>
                    <span>Title:</span>
                    <label className="label mb-4 w-full">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="input input-bordered w-full"
                        />
                    </label>
                    <span>Description:</span>
                    <label className="label mb-4 w-full">
                    <PencilIcon className="h-5 w-5 mr-2" />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="textarea textarea-bordered w-full"
                        />
                    </label>
                    <span>Level:</span>
                    <label className="label mb-4 w-full">
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    <select value={level} onChange={(e) => setLevel(e.target.value)}
                    className="select select-bordered w-full">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="pro">Pro</option>
                </select>
                    </label>
                    <span>Duration (in minutes):</span>
                    <label className="label mb-4 w-full">
                    <ClockIcon className="h-5 w-5 mr-2" />  
                        <input
                            type="number"
                            min="0"
                            placeholder="Duration"
                            value={duration}
                            onChange={e => setDuration(parseInt(e.target.value))}
                            className="input input-bordered w-full"
                        />
                    </label>
                    <span>Private:</span>
                    <label className="label mb-4 w-full">
                    <LockClosedIcon className="h-5 w-5 mr-2" />
                        <select
                            value={isPrivate ? 'Private' : 'Public'}
                            onChange={e => setIsPrivate(e.target.value === 'Private')}
                            className="select select-bordered w-full"
                        >
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                        </select>
                    </label>
                    <button type="submit" className="btn bg-yellow-500 px-8 py-4 w-full md:auto rounded">Add Exercise</button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
                </form>
            </div>
        </div>
    );
};

export default NewExerciseForm;