import Button from "./Button";

const ListItem = ({ name, phone, onRemove }) => {
    return (
      <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg space-x-4">
        <span>{name} ({phone})</span>
        <Button className="text-red-500" onClick={onRemove}>
          Remove
        </Button>
      </div>
    );
  };
  
  export default ListItem;
  