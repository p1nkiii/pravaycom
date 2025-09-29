'use client'

interface ConversationCardProps {
  passion: any
  index: number
}

export default function ConversationCard({ passion, index }: ConversationCardProps) {
  const openPlanModal = (passionId: string) => {
    const modal = document.getElementById(`plan-modal-${passionId}`)
    if (modal) {
      modal.classList.remove('hidden')
    }
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold">#{index + 1}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Passion Discovery Session
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(passion.created_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              passion.done 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {passion.done ? 'Completed' : 'In Progress'}
            </span>
            <a
              href={`/passion/${passion.id}`}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              {passion.done ? 'View' : 'Continue'}
            </a>
            {passion.done && passion.plan && (
              <button
                onClick={() => openPlanModal(passion.id)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                View Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Plan Modal */}
      {passion.done && passion.plan && (
        <div id={`plan-modal-${passion.id}`} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 hidden">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Your Passion Plan</h2>
              <button
                onClick={() => {
                  const modal = document.getElementById(`plan-modal-${passion.id}`)
                  if (modal) {
                    modal.classList.add('hidden')
                  }
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: passion.plan.replace(/\n/g, '<br>') }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
