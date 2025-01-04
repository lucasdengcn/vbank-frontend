'use client';

function List() {
    return (
        <ul role="list" className="p-6 divide-y divide-slate-200">
            <li className="flex py-4 first:pt-0 last:pb-0">
                <img className="h-10 w-10 rounded-full" src="/erin-lindford.jpg" alt="" />
                <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-slate-900">John</p>
                    <p className="text-sm text-slate-500 truncate">John@example.com</p>
                </div>
            </li>
            <li className="flex py-4 first:pt-0 last:pb-0">
                <img className="h-10 w-10 rounded-full" src="/erin-lindford.jpg" alt="" />
                <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-slate-900">John</p>
                    <p className="text-sm text-slate-500 truncate">John@example.com</p>
                </div>
            </li>
            <li className="flex py-4 first:pt-0 last:pb-0">
                <img className="h-10 w-10 rounded-full" src="/erin-lindford.jpg" alt="" />
                <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-slate-900">John</p>
                    <p className="text-sm text-slate-500 truncate">John@example.com</p>
                </div>
            </li>
            <li className="flex py-4 first:pt-0 last:pb-0">
                <img className="h-10 w-10 rounded-full" src="/erin-lindford.jpg" alt="" />
                <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-slate-900">John</p>
                    <p className="text-sm text-slate-500 truncate">John@example.com</p>
                </div>
            </li>
        </ul>
    );
}

export default List;