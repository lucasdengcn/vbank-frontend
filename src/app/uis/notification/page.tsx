'use client';

function Notification() {
    return (
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center gap-x-4">
            <div className="shrink-0">
                <img className="size-12" src="/next.svg" alt="ChitChat Logo"></img>
            </div>
            <div>
                <div className="text-xl font-medium text-black">ChitChat</div>
                <p className="text-slate-500">You have a new message!</p>
            </div>
        </div>
    );
}

export default Notification;