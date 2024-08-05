import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import Button from './ui/button/Button';
import * as Tooltip from './ui/Tooltip';

export const InfoBloc: React.FC<{ title: string; help?: React.ReactNode; children: React.ReactNode }> = ({ title, children, help }) => {
    return (
        <div className="flex flex-col gap-1 relative min-w-[468px]">
            <div className="flex items-center gap-2">
                <div className="text-gray-400 text-xs uppercase">{title}</div>
                {help && (
                    <Tooltip.Tooltip delayDuration={0}>
                        <Tooltip.TooltipTrigger asChild>
                            <Button variant="icon" size={'xs'}>
                                <QuestionMarkCircledIcon />
                            </Button>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent side="right">
                            <div className="flex text-white text-sm upper">{help}</div>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                )}
            </div>
            <div className="flex items-center gap-2 text-white text-sm">{children}</div>
        </div>
    );
};
