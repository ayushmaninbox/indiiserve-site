import { Enquiry } from './types';
import { readCsv, writeCsv } from './csvUtils';

const ENQUIRIES_CSV_FILENAME = 'enquiries.csv';

export const readEnquiries = (): Enquiry[] => {
    return readCsv<Enquiry>(ENQUIRIES_CSV_FILENAME);
};

export const writeEnquiries = (enquiries: Enquiry[]): void => {
    writeCsv(ENQUIRIES_CSV_FILENAME, enquiries);
};

export const updateEnquiryStatus = (id: string, status: 'pending' | 'solved'): Enquiry | null => {
    const enquiries = readEnquiries();
    const index = enquiries.findIndex(e => String(e.id) === id);
    if (index === -1) return null;

    enquiries[index].status = status;
    writeEnquiries(enquiries);
    return enquiries[index];
};

export const deleteEnquiry = (id: string): boolean => {
    const enquiries = readEnquiries();
    const filtered = enquiries.filter(e => String(e.id) !== id);
    if (filtered.length === enquiries.length) return false;

    writeEnquiries(filtered);
    return true;
};
