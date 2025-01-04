'use client';

function Page() {
    return (
        <table className="min-w-full divide-y divide-slate-200 text-sm p-10 gap-10">
            <thead className="bg-slate-100 text-sm font:medeium text-slate-500">
                <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                <tr className="odd:bg-white even:bg-slate-50">
                    <td>John</td>
                    <td>Senior Designer</td>
                    <td>John@example.com</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                    <td>John</td>
                    <td>Senior Designer</td>
                    <td>John@example.com</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                    <td>John</td>
                    <td>Senior Designer</td>
                    <td>John@example.com</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                    <td>John</td>
                    <td>Senior Designer</td>
                    <td>John@example.com</td>
                </tr>
                <tr className="odd:bg-white even:bg-slate-50">
                    <td>John</td>
                    <td>Senior Designer</td>
                    <td>John@example.com</td>
                </tr>
            </tbody>
        </table>
    );
}

export default Page;