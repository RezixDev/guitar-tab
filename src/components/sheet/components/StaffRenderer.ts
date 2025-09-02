// components/StaffRenderer.ts
import { Note } from '../types/music';
import { staffConfig } from '../constants/music';

export class StaffRenderer {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        this.ctx = ctx;
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    drawStaff(notes: Note[], currentNoteIndex: number, playheadPosition: number, playbackStartIndex: number, tempo: number) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawTitle(tempo);
        this.drawPlayhead(playheadPosition);
        this.drawStaffLines();
        this.drawClefAndTimeSignature();
        this.drawNotes(notes, currentNoteIndex, playbackStartIndex);
    }

    private drawTitle(tempo: number) {
        // Draw title
        this.ctx.fillStyle = '#020817';
        this.ctx.font = '600 24px system-ui, -apple-system, sans-serif';
        this.ctx.fillText('Interactive Composition', 30, 50);

        // Draw tempo marking
        this.ctx.font = '400 14px system-ui, -apple-system, sans-serif';
        this.ctx.fillStyle = '#64748b';
        this.ctx.fillText(`♩ = ${tempo} BPM`, 30, 80);
    }

    private drawPlayhead(playheadPosition: number) {
        if (playheadPosition >= 0 && playheadPosition <= this.canvas.width) {
            this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(playheadPosition, staffConfig.topMargin - 20);
            this.ctx.lineTo(playheadPosition, staffConfig.topMargin + staffConfig.staffHeight + 20);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    private drawStaffLines() {
        // Draw staff lines for each measure
        for (let measure = 0; measure < staffConfig.measures; measure++) {
            const measureX = staffConfig.leftMargin + (measure * staffConfig.measureWidth);

            // Draw staff lines
            this.ctx.strokeStyle = '#e2e8f0';
            this.ctx.lineWidth = 1.5;
            for (let i = 0; i < 5; i++) {
                const y = staffConfig.topMargin + (i * staffConfig.lineSpacing);
                this.ctx.beginPath();
                this.ctx.moveTo(measureX, y);
                this.ctx.lineTo(measureX + staffConfig.measureWidth, y);
                this.ctx.stroke();
            }

            // Draw measure lines
            this.ctx.strokeStyle = '#94a3b8';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(measureX, staffConfig.topMargin);
            this.ctx.lineTo(measureX, staffConfig.topMargin + staffConfig.staffHeight);
            this.ctx.stroke();

            // Draw end barline
            if (measure === staffConfig.measures - 1) {
                this.ctx.lineWidth = 3;
                this.ctx.strokeStyle = '#475569';
                this.ctx.beginPath();
                this.ctx.moveTo(measureX + staffConfig.measureWidth, staffConfig.topMargin);
                this.ctx.lineTo(measureX + staffConfig.measureWidth, staffConfig.topMargin + staffConfig.staffHeight);
                this.ctx.stroke();
            }
        }
    }

    private drawClefAndTimeSignature() {
        // Draw clef
        this.ctx.font = 'bold 52px serif';
        this.ctx.fillStyle = '#020817';
        this.ctx.fillText('𝄞', staffConfig.leftMargin - 55, staffConfig.topMargin + 40);

        // Draw time signature
        this.ctx.font = '600 30px system-ui, -apple-system, sans-serif';
        this.ctx.fillStyle = '#334155';
        this.ctx.fillText('4', staffConfig.leftMargin - 25, staffConfig.topMargin + 20);
        this.ctx.fillText('4', staffConfig.leftMargin - 25, staffConfig.topMargin + 48);
    }

    private drawNotes(notes: Note[], currentNoteIndex: number, playbackStartIndex: number) {
        notes.forEach((note, index) => {
            const isCurrentNote = index === currentNoteIndex;
            const isStartPoint = index === playbackStartIndex && currentNoteIndex === -1;
            this.drawNote(note, isCurrentNote, isStartPoint);
        });
    }

    private drawNote(note: Note, isPlaying: boolean, isStartPoint: boolean) {
        const x = staffConfig.leftMargin + note.x;
        const y = staffConfig.topMargin + (note.staffPosition * staffConfig.lineSpacing) + (staffConfig.staffHeight / 2);

        this.drawLedgerLines(note, x);
        this.drawNoteHighlight(x, y, isPlaying, isStartPoint);
        this.drawNoteHead(note, x, y, isPlaying);
        this.drawStem(note, x, y, isPlaying);
    }

    private drawLedgerLines(note: Note, x: number) {
        if (!note.ledger) return;

        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 1.5;

        if (note.staffPosition < 0) {
            for (let pos = -0.5; pos >= note.staffPosition; pos -= 1) {
                const ledgerY = staffConfig.topMargin + (pos * staffConfig.lineSpacing) + (staffConfig.staffHeight / 2);
                this.ctx.beginPath();
                this.ctx.moveTo(x - 18, ledgerY);
                this.ctx.lineTo(x + 18, ledgerY);
                this.ctx.stroke();
            }
        } else if (note.staffPosition > 4) {
            for (let pos = 4.5; pos <= note.staffPosition; pos += 1) {
                const ledgerY = staffConfig.topMargin + (pos * staffConfig.lineSpacing) + (staffConfig.staffHeight / 2);
                this.ctx.beginPath();
                this.ctx.moveTo(x - 18, ledgerY);
                this.ctx.lineTo(x + 18, ledgerY);
                this.ctx.stroke();
            }
        }
    }

    private drawNoteHighlight(x: number, y: number, isPlaying: boolean, isStartPoint: boolean) {
        // Highlight if playing
        if (isPlaying) {
            this.ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 20, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 12, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Highlight start point
        if (isStartPoint) {
            this.ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([3, 3]);
            this.ctx.beginPath();
            this.ctx.arc(x, y, 16, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    private drawNoteHead(note: Note, x: number, y: number, isPlaying: boolean) {
        const noteColor = isPlaying ? '#6366f1' : '#020817';

        this.ctx.fillStyle = note.duration === 'whole' || note.duration === 'half' ? '#ffffff' : noteColor;
        this.ctx.strokeStyle = noteColor;
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, 9, 7, -0.25, 0, Math.PI * 2);

        if (note.duration === 'whole' || note.duration === 'half') {
            this.ctx.stroke();
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fill();
        } else {
            this.ctx.fill();
        }
    }

    private drawStem(note: Note, x: number, y: number, isPlaying: boolean) {
        if (note.duration === 'whole') return;

        const noteColor = isPlaying ? '#6366f1' : '#020817';
        const stemDirection = note.staffPosition > 1 ? -1 : 1;
        const stemHeight = 40;

        this.ctx.strokeStyle = noteColor;
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.moveTo(x + (stemDirection === 1 ? 8 : -8), y);
        this.ctx.lineTo(x + (stemDirection === 1 ? 8 : -8), y + (stemHeight * stemDirection));
        this.ctx.stroke();

        // Draw flags
        if (note.duration === 'eighth' || note.duration === 'sixteenth') {
            this.drawFlags(note, x, y, stemDirection, stemHeight, noteColor);
        }
    }

    private drawFlags(note: Note, x: number, y: number, stemDirection: number, stemHeight: number, noteColor: string) {
        const flagY = y + (stemHeight * stemDirection);
        this.ctx.strokeStyle = noteColor;
        this.ctx.lineWidth = 2;

        // First flag
        this.ctx.beginPath();
        this.ctx.moveTo(x + (stemDirection === 1 ? 8 : -8), flagY);
        this.ctx.quadraticCurveTo(
            x + (stemDirection === 1 ? 18 : -18),
            flagY + (18 * stemDirection),
            x + (stemDirection === 1 ? 14 : -14),
            flagY + (28 * stemDirection)
        );
        this.ctx.stroke();

        // Second flag for sixteenth notes
        if (note.duration === 'sixteenth') {
            this.ctx.beginPath();
            this.ctx.moveTo(x + (stemDirection === 1 ? 8 : -8), flagY + 10);
            this.ctx.quadraticCurveTo(
                x + (stemDirection === 1 ? 18 : -18),
                flagY + 10 + (18 * stemDirection),
                x + (stemDirection === 1 ? 14 : -14),
                flagY + 10 + (28 * stemDirection)
            );
            this.ctx.stroke();
        }
    }
}