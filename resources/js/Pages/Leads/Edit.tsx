import LeadForm from './LeadForm';

type Lead = {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
};

type Props = {
    lead: Lead;
    statuses: string[];
};

export default function Edit({ lead, statuses }: Props) {
    return <LeadForm lead={lead} statuses={statuses} />;
}
