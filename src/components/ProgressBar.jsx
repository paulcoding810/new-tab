const ProgressBar = ({progress}) => {

  return (
    <div className="w-full h-1 bg-gray-400 rounded">
      <div className="h-1 bg-blue-500 rounded" style={{ width: `${progress}%` }}></div>
    </div>
  )
}

export default ProgressBar;