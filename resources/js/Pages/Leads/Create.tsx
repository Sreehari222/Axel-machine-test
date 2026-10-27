import LeadForm from './LeadForm';

type Props = {
    statuses: string[];
};

export default function Create({ statuses }: Props) {
    return <LeadForm statuses={statuses} />;
}
