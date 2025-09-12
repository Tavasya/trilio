
import Calendar from '../../components/post/Calendar';

export default function Scheduler() {
    return (
      <div className="h-full p-6 bg-gray-50/30">
        <div className="h-full bg-white rounded-xl shadow-sm overflow-hidden">
          <Calendar />
        </div>
      </div>
    )
}