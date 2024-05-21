import { useState, useEffect } from 'react';
import { createNewExercise } from '../../api/api';
import { useApp } from '../../hooks/useApp';

const NewExerciseForm = () => {
    const app = useApp();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('');
    const [duration, setDuration] = useState(0);
    const [isPrivate, setIsPrivate] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (app.currentUser) {
            const exercise = {
                title,
                description,
                level,
                duration,
                isPrivate
            };
            await createNewExercise(app, exercise);
        }
    };

    return (
        <div className="flex justify-center">
            <div className="form-control w-auto md:w-1/2 lg:w-1/3 mx-auto p-4 bg-base-200 rounded-box">
                <form onSubmit={handleSubmit}>
                <span>Title</span>
                    <label className="label mb-1 w-full">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="input input-bordered w-full"
                        />
                    </label>
                    <span>Description</span>
                    <label className="label mb-1 w-full">
                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="input input-bordered w-full"
                        />
                    </label>
                    <span>Level</span>
                    <label className="label mb-1 w-full">
                        <input
                            type="text"
                            placeholder="Level"
                            value={level}
                            onChange={e => setLevel(e.target.value)}
                            className="input input-bordered w-full"
                        />
                    </label>
                    <span>Duration</span>
                    <label className="label mb-1 w-full">
                        <input
                            type="number"
                            min="0"
                            placeholder="Duration"
                            value={duration}
                            className="input input-bordered w-full"
                            onChange={e =>  {
                                const value = parseInt(e.target.value);
                                setDuration(isNaN(value) ? 0:value);
                            }
                        }
                        />
                    </label>
                    <span>make private</span>
                    <label className="label mb-1 w-full">
                        <select
                            value={isPrivate ? 'Private' : 'Public'}
                            onChange={e => setIsPrivate(e.target.value === 'Private')}
                            className="select select-bordered w-full"
                        >
                            <option>Public</option>
                            <option>Private</option>
                        </select>
                    </label>
                    <button type="submit" className="btn bg-yellow-500 px-8 py-4 w-full md:auto">Add Exercise</button>
                </form>
            </div>
        </div>
    );
};

export default NewExerciseForm;