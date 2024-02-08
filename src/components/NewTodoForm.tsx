import { FormEvent, useState } from 'react';


export const NewTodoForm = ({ onSubmit = (x: string): void => {x} }): JSX.Element => {
  const [newItem, setNewItem] = useState('');

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    if (newItem === '') return;
    onSubmit(newItem);

    setNewItem('');
  };

  return (
    <form className="tw-mb-4" onSubmit={handleSubmit}>
      <div className="tw-flex tw-flex-col">
        <label className="tw-font-bold" htmlFor='item'>New Item</label>
        <input
          type="text"
          id="item"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
        />
      </div>
      <button>Add</button>
    </form>
  )
}
